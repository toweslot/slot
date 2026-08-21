<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;
use RuntimeException;

final class FinanceService
{
    private mixed $provider;

    public function __construct(
        private readonly PDO $pdo,
        private readonly array $config,
        private readonly ConfigService $configService,
        private readonly UserService $userService
    ) {
        $mergedConfig = $this->config;
        $gw = $this->configService->get('gateway', []);
        if (!empty($gw['provider'])) {
            $mergedConfig['payment']['provider'] = $gw['provider'];
        }
        $this->provider = PaymentFactory::make($mergedConfig);
    }

    private function isProduction(): bool
    {
        return strtolower((string)($this->config['app']['env'] ?? 'local')) === 'production';
    }

    private function firstDepositBonusConfig(): array
    {
        $cfg = $this->configService->get('bonus_primeiro_deposito', []);
        $enabled = (bool)($cfg['enabled'] ?? true);
        $percentual = (float)($cfg['percentual_bonus'] ?? 100);
        $rolloverMult = (float)($cfg['rollover_multiplicador'] ?? 3);
        $modoRaw = strtolower(trim((string)($cfg['modo_aplicacao'] ?? $cfg['apply_mode'] ?? 'primeiro_deposito')));
        $modo = in_array($modoRaw, ['sempre', 'always'], true) ? 'sempre' : 'primeiro_deposito';

        return [
            'enabled' => $enabled,
            'percentual_bonus' => $percentual > 0 ? $percentual : 100.0,
            'rollover_multiplicador' => $rolloverMult > 0 ? $rolloverMult : 3.0,
            'modo_aplicacao' => $modo,
        ];
    }

    private function userBonusRollover(array $user): array
    {
        $cfg = $this->firstDepositBonusConfig();
        $recebeu = (int)($user['recebeu_bonus_primeiro_deposito'] ?? 0) === 1;
        $deposito = round((float)($user['primeiro_deposito_valor'] ?? 0), 2);
        $bonus = round((float)($user['bonus_primeiro_deposito_valor'] ?? 0), 2);
        $total = round((float)($user['primeiro_deposito_total_com_bonus'] ?? 0), 2);
        $exigido = round((float)($user['rollover_exigido_bonus'] ?? 0), 2);
        $cumprido = round((float)($user['rollover_cumprido_bonus'] ?? 0), 2);
        $restante = round((float)($user['rollover_restante_bonus'] ?? max(0, $exigido - $cumprido)), 2);
        $liberado = (int)($user['saque_liberado_bonus'] ?? ($restante <= 0 ? 1 : 0)) === 1;

        if (!$recebeu) {
            $liberado = true;
            $restante = 0.0;
        }

        return [
            'enabled' => (bool)($cfg['enabled'] ?? true),
            'modo_aplicacao' => (string)($cfg['modo_aplicacao'] ?? 'primeiro_deposito'),
            'percentual_bonus' => (float)($cfg['percentual_bonus'] ?? 100),
            'rollover_multiplicador' => (float)($cfg['rollover_multiplicador'] ?? 3),
            'recebeu_bonus_primeiro_deposito' => $recebeu,
            'primeiro_deposito_valor' => $deposito,
            'bonus_recebido_valor' => $bonus,
            'total_com_bonus' => $total,
            'rollover_necessario' => $exigido,
            'rollover_cumprido' => $cumprido,
            'rollover_restante' => $restante,
            'saque_liberado' => $liberado,
            'status_saque' => $liberado ? 'liberado' : 'bloqueado',
        ];
    }

    public function depositoInfo(): array
    {
        $game = $this->configService->get('game', []);
        $bonus = $this->configService->get('deposito_bonus', []);
        $primeiroBonus = $this->firstDepositBonusConfig();
        $depositoMinimo = max(15.0, (float)($game['deposito_minimo'] ?? 15));
        $saqueAfilMinimo = max(50.0, (float)($game['saque_afiliado_minimo'] ?? 50));

        return array_merge($bonus, [
            'primeiro_deposito_bonus' => $primeiroBonus,
            'limites' => [
                'deposito_minimo' => $depositoMinimo,
                'deposito_maximo' => (float)($game['deposito_maximo'] ?? 0),
                'saque_minimo' => (float)($game['saque_minimo'] ?? 20),
                'saque_maximo' => (float)($game['saque_maximo'] ?? 0),
                'saque_afiliado_minimo' => $saqueAfilMinimo,
                'saque_afiliado_maximo' => (float)($game['saque_afiliado_maximo'] ?? 0),
            ]
        ]);
    }

    public function criarDeposito(array $user, array $payload): array
    {
        $info = $this->depositoInfo();
        $lim = $info['limites'];

        $valor = round((float)($payload['valor'] ?? 0), 2);
        if ($valor < (float)$lim['deposito_minimo']) {
            throw new RuntimeException('Valor mínimo: R$ ' . number_format((float)$lim['deposito_minimo'], 2, ',', '.'));
        }
        if ((float)$lim['deposito_maximo'] > 0 && $valor > (float)$lim['deposito_maximo']) {
            throw new RuntimeException('Valor máximo: R$ ' . number_format((float)$lim['deposito_maximo'], 2, ',', '.'));
        }

        $external = Util::randomRef('DEP');
        $providerName = strtolower((string)($this->configService->get('gateway', [])['provider'] ?? $this->config['payment']['provider'] ?? 'mock'));
        if ($providerName === 'mock' && $this->isProduction()) {
            throw new RuntimeException('Gateway mock desativado em producao. Selecione sigilopay/ecompag/amplopay no admin.');
        }
        $webhook = rtrim((string)$this->config['app']['url'], '/') . '/api/webhooks/deposito';
        if (in_array($providerName, ['ecompag', 'ecopag'], true)) {
            $secret = (string)(($this->config['payment']['ecompag']['webhook_secret'] ?? '') ?: ($this->config['payment']['ecopag']['webhook_secret'] ?? ''));
            if ($secret !== '') {
                $webhook .= '?secret=' . rawurlencode($secret);
            }
        }
        if (in_array($providerName, ['sigilopay', 'sigilo'], true)) {
            $secret = (string)($this->config['payment']['sigilopay']['webhook_secret'] ?? '');
            if ($secret !== '') {
                $webhook .= '?secret=' . rawurlencode($secret);
            }
        }
        if (in_array($providerName, ['amplopay', 'amplo'], true)) {
            $secret = (string)($this->config['payment']['amplopay']['webhook_secret'] ?? '');
            if ($secret !== '') {
                $webhook .= '?secret=' . rawurlencode($secret);
            }
        }

        // Auto-gera email se nao houver, evitando erros nos gateways que exigem email do cliente.
        $emailIn = trim((string)($payload['email'] ?? ''));
        if ($emailIn === '' || !filter_var($emailIn, FILTER_VALIDATE_EMAIL)) {
            $slugNome = preg_replace('/[^a-z0-9]+/', '', strtolower((string)($payload['nome'] ?? 'user'))) ?: 'user';
            $slugNome = substr($slugNome, 0, 12);
            $emailIn = $slugNome . '.' . substr(bin2hex(random_bytes(4)), 0, 8) . '@jumppx.com';
        }

        $providerResp = $this->provider->createDeposit([
            'valor' => $valor,
            'cpf' => $payload['cpf'] ?? '',
            'nome' => $payload['nome'] ?? '',
            'email' => $emailIn,
            'telefone' => $payload['telefone'] ?? '',
            'webhook_url' => $webhook,
            'external_reference' => $external,
        ]);

        $txid = (string)($providerResp['txid'] ?? Util::randomRef('TX'));
        $now = Util::now();
        $exp = date('Y-m-d H:i:s', time() + ((int)($providerResp['expiracao_minutos'] ?? 30) * 60));
        $meta = $providerResp['meta'] ?? [];
        if (!is_array($meta)) {
            $meta = [];
        }
        $meta['external_reference'] = $external;
        $meta['provider'] = $providerName;

        $stmt = $this->pdo->prepare('INSERT INTO depositos (txid,user_id,provider,valor,status,qrcode_texto,qrcode_imagem,expires_at,provider_ref,meta_json,created_at,updated_at)
                                     VALUES (:txid,:uid,:provider,:valor,:status,:qr,:qri,:exp,:pref,:meta,:c,:u)');
        $stmt->execute([
            ':txid' => $txid,
            ':uid' => (int)$user['id'],
            ':provider' => $providerName,
            ':valor' => $valor,
            ':status' => (string)($providerResp['status'] ?? 'pendente'),
            ':qr' => (string)($providerResp['qrcode_texto'] ?? ''),
            ':qri' => (string)($providerResp['qrcode_imagem'] ?? ''),
            ':exp' => $exp,
            ':pref' => (string)($providerResp['provider_ref'] ?? ''),
            ':meta' => json_encode($meta, JSON_UNESCAPED_UNICODE),
            ':c' => $now,
            ':u' => $now,
        ]);

        return [
            'txid' => $txid,
            'qrcode_texto' => (string)($providerResp['qrcode_texto'] ?? ''),
            'qrcode_imagem' => (string)($providerResp['qrcode_imagem'] ?? ''),
            'expiracao_minutos' => (int)($providerResp['expiracao_minutos'] ?? 30),
            'status' => 'pendente',
        ];
    }

    public function depositoStatus(array $user, string $txid): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM depositos WHERE txid=:txid AND user_id=:uid LIMIT 1');
        $stmt->execute([':txid' => $txid, ':uid' => (int)$user['id']]);
        $dep = $stmt->fetch();
        if (!$dep) {
            throw new RuntimeException('Depósito não encontrado.');
        }

        if ($dep['status'] === 'aprovado') {
            return ['status' => 'aprovado', 'valor' => (float)$dep['valor'], 'saldo_novo' => (float)$this->userService->byId((int)$user['id'])['saldo']];
        }
        if ($dep['status'] === 'cancelado') {
            return ['status' => 'cancelado'];
        }

        if (strtolower((string)($dep['provider'] ?? '')) === 'mock' && $this->isProduction()) {
            throw new RuntimeException('Deposito mock bloqueado em producao.');
        }

        $res = $this->provider->getDepositStatus($dep);
        $status = (string)($res['status'] ?? 'pendente');

        if ($status === 'aprovado') {
            $valor = (float)($res['valor'] ?? $dep['valor']);
            $saldoNovo = $this->aprovarDeposito((int)$dep['id'], $valor);
            return ['status' => 'aprovado', 'valor' => $valor, 'saldo_novo' => $saldoNovo];
        }

        if ($status === 'cancelado') {
            $stmt = $this->pdo->prepare('UPDATE depositos SET status=\'cancelado\', updated_at=:u WHERE id=:id');
            $stmt->execute([':u' => Util::now(), ':id' => (int)$dep['id']]);
            return ['status' => 'cancelado'];
        }

        return ['status' => 'pendente'];
    }

    public function aprovarDeposito(int $depositoId, float $valorConfirmado): float
    {
        $stmt = $this->pdo->prepare('SELECT * FROM depositos WHERE id=:id LIMIT 1');
        $stmt->execute([':id' => $depositoId]);
        $dep = $stmt->fetch();
        if (!$dep) {
            throw new RuntimeException('Depósito inválido.');
        }

        if ($dep['status'] === 'aprovado') {
            $u = $this->userService->byId((int)$dep['user_id']);
            return (float)($u['saldo'] ?? 0);
        }

        $valor = round(max(0, $valorConfirmado), 2);
        $agora = Util::now();

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE depositos SET status=\'aprovado\', valor=:v, updated_at=:u WHERE id=:id');
            $stmt->execute([':v' => $valor, ':u' => $agora, ':id' => $depositoId]);

            $depUser = $this->userService->byId((int)$dep['user_id']);
            if (!$depUser) {
                throw new RuntimeException('Usuario do deposito nao encontrado.');
            }

            $bonusCfg = $this->firstDepositBonusConfig();
            $bonusModo = (string)($bonusCfg['modo_aplicacao'] ?? 'primeiro_deposito');
            $bonusValor = 0.0;
            $rolloverAdicional = 0.0;
            $creditadoTotal = $valor;
            $aplicouBonusDeposito = false;

            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM depositos WHERE user_id=:uid AND status=\'aprovado\'');
            $stmt->execute([':uid' => (int)$dep['user_id']]);
            $totalAprovados = (int)($stmt->fetch()['c'] ?? 0);

            $jaRecebeuBonus = (int)($depUser['recebeu_bonus_primeiro_deposito'] ?? 0) === 1;
            $ehPrimeiroDeposito = $totalAprovados === 1;
            $deveAplicarBonus = false;
            if ($bonusCfg['enabled']) {
                if ($bonusModo === 'sempre') {
                    $deveAplicarBonus = true;
                } else {
                    $deveAplicarBonus = !$jaRecebeuBonus && $ehPrimeiroDeposito;
                }
            }
            if ($deveAplicarBonus) {
                $bonusValor = round($valor * (((float)$bonusCfg['percentual_bonus']) / 100), 2);
                if ($bonusValor > 0) {
                    $creditadoTotal = round($valor + $bonusValor, 2);
                    $rolloverAdicional = round($creditadoTotal * (float)$bonusCfg['rollover_multiplicador'], 2);
                    $aplicouBonusDeposito = true;
                }
            }

            if ($aplicouBonusDeposito) {
                $rolloverExigidoAtual = round((float)($depUser['rollover_exigido_bonus'] ?? 0), 2);
                $rolloverCumpridoAtual = round((float)($depUser['rollover_cumprido_bonus'] ?? 0), 2);
                $rolloverRestanteAtual = round((float)($depUser['rollover_restante_bonus'] ?? max(0, $rolloverExigidoAtual - $rolloverCumpridoAtual)), 2);

                $novoRolloverExigido = round($rolloverExigidoAtual + $rolloverAdicional, 2);
                $novoRolloverCumprido = round(min($novoRolloverExigido, $rolloverCumpridoAtual), 2);
                $novoRolloverRestante = round(max(0, $rolloverRestanteAtual + $rolloverAdicional), 2);
                $novoSaqueLiberado = $novoRolloverRestante <= 0 ? 1 : 0;

                if (!$jaRecebeuBonus) {
                    $stmt = $this->pdo->prepare(
                        'UPDATE users
                         SET saldo = saldo + :credito,
                             recebeu_bonus_primeiro_deposito = 1,
                             primeiro_deposito_valor = :primeiro_dep,
                             bonus_primeiro_deposito_valor = :bonus,
                             primeiro_deposito_total_com_bonus = :total_bonus,
                             rollover_exigido_bonus = :rollover_exigido,
                             rollover_cumprido_bonus = :rollover_cumprido,
                             rollover_restante_bonus = :rollover_restante,
                             saque_liberado_bonus = :saque_liberado,
                             updated_at = :u
                         WHERE id = :id'
                    );
                    $stmt->execute([
                        ':credito' => $creditadoTotal,
                        ':primeiro_dep' => $valor,
                        ':bonus' => $bonusValor,
                        ':total_bonus' => $creditadoTotal,
                        ':rollover_exigido' => $novoRolloverExigido,
                        ':rollover_cumprido' => $novoRolloverCumprido,
                        ':rollover_restante' => $novoRolloverRestante,
                        ':saque_liberado' => $novoSaqueLiberado,
                        ':u' => $agora,
                        ':id' => (int)$dep['user_id'],
                    ]);
                } else {
                    $stmt = $this->pdo->prepare(
                        'UPDATE users
                         SET saldo = saldo + :credito,
                             rollover_exigido_bonus = :rollover_exigido,
                             rollover_cumprido_bonus = :rollover_cumprido,
                             rollover_restante_bonus = :rollover_restante,
                             saque_liberado_bonus = :saque_liberado,
                             updated_at = :u
                         WHERE id = :id'
                    );
                    $stmt->execute([
                        ':credito' => $creditadoTotal,
                        ':rollover_exigido' => $novoRolloverExigido,
                        ':rollover_cumprido' => $novoRolloverCumprido,
                        ':rollover_restante' => $novoRolloverRestante,
                        ':saque_liberado' => $novoSaqueLiberado,
                        ':u' => $agora,
                        ':id' => (int)$dep['user_id'],
                    ]);
                }
            } else {
                $stmt = $this->pdo->prepare('UPDATE users SET saldo = saldo + :v, updated_at=:u WHERE id=:id');
                $stmt->execute([':v' => $valor, ':u' => $agora, ':id' => (int)$dep['user_id']]);
            }

            $metaDeposito = [];
            if ($aplicouBonusDeposito) {
                $metaDeposito = [
                    'bonus_deposito_aplicado' => 1,
                    'valor_deposito' => $valor,
                    'valor_bonus' => $bonusValor,
                    'valor_total_creditado' => $creditadoTotal,
                    'rollover_adicional' => $rolloverAdicional,
                    'rollover_multiplicador' => (float)$bonusCfg['rollover_multiplicador'],
                    'modo_aplicacao_bonus' => $bonusModo,
                ];
            }

            $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'deposito\',:v,\'aprovado\',:r,:m,:c)');
            $stmt->execute([
                ':uid' => (int)$dep['user_id'],
                ':v' => $valor,
                ':r' => (string)$dep['txid'],
                ':m' => json_encode($metaDeposito, JSON_UNESCAPED_UNICODE),
                ':c' => $agora,
            ]);

            if ($aplicouBonusDeposito) {
                $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'bonus_primeiro_deposito\',:v,\'aprovado\',:r,:m,:c)');
                $stmt->execute([
                    ':uid' => (int)$dep['user_id'],
                    ':v' => $bonusValor,
                    ':r' => (string)$dep['txid'],
                    ':m' => json_encode([
                        'valor_deposito' => $valor,
                        'valor_total_creditado' => $creditadoTotal,
                        'rollover_adicional' => $rolloverAdicional,
                        'modo_aplicacao_bonus' => $bonusModo,
                    ], JSON_UNESCAPED_UNICODE),
                    ':c' => $agora,
                ]);
            }

            // comissão de indicação por depósito
            $depUser = $this->userService->byId((int)$dep['user_id']);
            $refId = (int)($depUser['convidado_por_id'] ?? 0);
            if ($refId > 0) {
                // Paga comissao apenas no primeiro deposito aprovado do indicado.
                $stmt = $this->pdo->prepare("SELECT COUNT(*) AS c FROM depositos WHERE user_id=:uid AND status='aprovado'");
                $stmt->execute([':uid' => (int)$dep['user_id']]);
                $qtdDepositosAprovados = (int)($stmt->fetch()['c'] ?? 0);

                if ($qtdDepositosAprovados === 1) {
                    // Regra de alternância: a cada 3 indicados que depositam,
                    // os 2 primeiros NÃO contam (ficam para o dono do site)
                    // e somente o 3º gera comissão. Ou seja: paga quando a
                    // ordem do indicado é múltipla de 3 (3º, 6º, 9º...).
                    $stmtOrd = $this->pdo->prepare("SELECT COUNT(DISTINCT u.id) AS c
                        FROM users u
                        JOIN depositos d ON d.user_id = u.id
                        WHERE u.convidado_por_id = :ref AND d.status = 'aprovado'");
                    $stmtOrd->execute([':ref' => $refId]);
                    $ordemIndicadoPago = (int)($stmtOrd->fetch()['c'] ?? 0);
                    if ($ordemIndicadoPago <= 0 || ($ordemIndicadoPago % 3) !== 0) {
                        // Pula este indicado — sem comissão (1º e 2º de cada trinca).
                        $u = $this->userService->byId((int)$dep['user_id']);
                        $this->pdo->commit();
                        return (float)($u['saldo'] ?? 0);
                    }

                    $indCfg = $this->configService->get('indicacao', []);
                    $perc = (float)($indCfg['comissao_nivel1_perc'] ?? 5);
                    $refUser = $this->userService->byId($refId);
                    $percCustom = isset($refUser['comissao_indicacao_perc']) ? (float)$refUser['comissao_indicacao_perc'] : 0.0;
                    if ($percCustom > 0) {
                        $perc = $percCustom;
                    }
                    $comissao = round($valor * ($perc / 100), 2);
                    if ($comissao > 0) {
                        $stmt = $this->pdo->prepare('UPDATE users SET saldo_afiliado = saldo_afiliado + :v, updated_at=:u WHERE id=:id');
                        $stmt->execute([':v' => $comissao, ':u' => $agora, ':id' => $refId]);

                        $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'bonus_indicacao\',:v,\'aprovado\',:r,:m,:c)');
                        $stmt->execute([
                            ':uid' => $refId,
                            ':v' => $comissao,
                            ':r' => (string)$dep['txid'],
                            ':m' => json_encode([
                                'user_id_indicado' => (int)$dep['user_id'],
                                'percentual' => $perc,
                                'regra' => 'primeiro_deposito_aprovado',
                            ], JSON_UNESCAPED_UNICODE),
                            ':c' => $agora,
                        ]);
                    }
                }
            }

            $u = $this->userService->byId((int)$dep['user_id']);
            $this->pdo->commit();
            return (float)($u['saldo'] ?? 0);
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function dashboard(array $user): array
    {
        $uid = (int)$user['id'];
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM partidas WHERE user_id=:uid');
        $stmt->execute([':uid' => $uid]);
        $partidas = (int)($stmt->fetch()['c'] ?? 0);

        $stmt = $this->pdo->prepare('SELECT COALESCE(SUM(valor),0) AS total FROM transacoes WHERE user_id=:uid AND tipo=\'bonus_indicacao\' AND status=\'aprovado\'');
        $stmt->execute([':uid' => $uid]);
        $totalComissao = (float)($stmt->fetch()['total'] ?? 0);

        $bonusInfo = $this->userBonusRollover($user);

        return [
            'saldo' => (float)$user['saldo'],
            'saldo_afiliado' => (float)$user['saldo_afiliado'],
            'total_partidas' => $partidas,
            'total_comissao' => $totalComissao,
            'bonus_primeiro_deposito' => $bonusInfo,
        ];
    }

    public function historico(array $user, int $pagina = 1, int $limite = 20): array
    {
        $pagina = max(1, $pagina);
        $limite = max(1, min(100, $limite));
        $offset = ($pagina - 1) * $limite;

        $stmt = $this->pdo->prepare('SELECT id,tipo,valor,status,created_at,referencia FROM transacoes WHERE user_id=:uid ORDER BY id DESC LIMIT :lim OFFSET :off');
        $stmt->bindValue(':uid', (int)$user['id'], PDO::PARAM_INT);
        $stmt->bindValue(':lim', $limite, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll() ?: [];

        return ['transacoes' => $rows, 'pagina' => $pagina, 'limite' => $limite];
    }

    public function solicitarSaque(array $user, float $valor, string $pix, string $cpf): array
    {
        $info = $this->depositoInfo();
        $lim = $info['limites'];
        $uAtual = $this->userService->byId((int)$user['id']) ?? $user;

        // Bloqueia saque enquanto o usuario nao fez nenhum deposito aprovado
        // (regra do bonus de boas-vindas R$ 260: precisa depositar o minimo da casa antes do 1o saque)
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM depositos WHERE user_id=:uid AND status=\'aprovado\'');
        $stmt->execute([':uid' => (int)$uAtual['id']]);
        $totalDeps = (int)($stmt->fetch()['c'] ?? 0);
        if ($totalDeps === 0) {
            $depMin = (float)$lim['deposito_minimo'];
            throw new RuntimeException('DEPOSITO_OBRIGATORIO|' . number_format($depMin, 2, '.', '') . '|Para liberar o saque do seu bonus voce precisa fazer um deposito de pelo menos R$ ' . number_format($depMin, 2, ',', '.') . '. Isso confirma sua conta e libera os saques.');
        }

        if ($valor < (float)$lim['saque_minimo']) {
            throw new RuntimeException('Saque mínimo: R$ ' . number_format((float)$lim['saque_minimo'], 2, ',', '.'));
        }
        if ((float)$lim['saque_maximo'] > 0 && $valor > (float)$lim['saque_maximo']) {
            throw new RuntimeException('Saque máximo: R$ ' . number_format((float)$lim['saque_maximo'], 2, ',', '.'));
        }
        $bonusInfo = $this->userBonusRollover($uAtual);
        if ($bonusInfo['recebeu_bonus_primeiro_deposito'] && !$bonusInfo['saque_liberado']) {
            throw new RuntimeException('Voce precisa completar o rollover para sacar. Falta R$ ' . number_format((float)$bonusInfo['rollover_restante'], 2, ',', '.') . '.');
        }
        if ($valor > (float)$uAtual['saldo']) {
            throw new RuntimeException('Saldo insuficiente.');
        }


        $agora = Util::now();
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE users SET saldo = saldo - :v, updated_at=:u WHERE id=:id');
            $stmt->execute([':v' => $valor, ':u' => $agora, ':id' => (int)$uAtual['id']]);

            $stmt = $this->pdo->prepare('INSERT INTO saques (user_id,tipo,valor,pix_chave,cpf,status,meta_json,created_at,updated_at) VALUES (:uid,\'saque\',:v,:pix,:cpf,\'pendente\',\'{}\',:c,:u)');
            $stmt->execute([
                ':uid' => (int)$uAtual['id'],
                ':v' => $valor,
                ':pix' => $pix,
                ':cpf' => $cpf,
                ':c' => $agora,
                ':u' => $agora,
            ]);

            $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'saque\',:v,\'pendente\',:ref,\'{}\',:c)');
            $stmt->execute([
                ':uid' => (int)$uAtual['id'],
                ':v' => $valor,
                ':ref' => 'SAQ-' . (int)$this->pdo->lastInsertId(),
                ':c' => $agora,
            ]);

            $newUser = $this->userService->byId((int)$uAtual['id']);
            $this->pdo->commit();
            return ['status' => 'pendente', 'saldo_novo' => (float)($newUser['saldo'] ?? 0)];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
    public function solicitarSaqueAfiliado(array $user, float $valor, string $pix): array
    {
        $info = $this->depositoInfo();
        $lim = $info['limites'];
        $minimo = max(50.0, (float)$lim['saque_afiliado_minimo']);

        if ($valor < $minimo) {
            throw new RuntimeException('Saque minimo: R$ ' . number_format($minimo, 2, ',', '.'));
        }
        if ((float)$lim['saque_afiliado_maximo'] > 0 && $valor > (float)$lim['saque_afiliado_maximo']) {
            throw new RuntimeException('Saque maximo: R$ ' . number_format((float)$lim['saque_afiliado_maximo'], 2, ',', '.'));
        }
        if ($valor > (float)$user['saldo_afiliado']) {
            throw new RuntimeException('Saldo de comissao insuficiente.');
        }
        if (trim($pix) === '') {
            throw new RuntimeException('Informe a chave PIX para saque da comissao.');
        }

        $agora = Util::now();
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE users SET saldo_afiliado = saldo_afiliado - :v, updated_at=:u WHERE id=:id');
            $stmt->execute([':v' => $valor, ':u' => $agora, ':id' => (int)$user['id']]);

            $nomeSolicitante = trim((string)($user['nome'] ?? ''));
            $stmt = $this->pdo->prepare('INSERT INTO saques (user_id,tipo,valor,pix_chave,cpf,nome_solicitante,status,meta_json,created_at,updated_at) VALUES (:uid,\'saque_afiliado\',:v,:pix,\'\',:nome,\'pendente\',:meta,:c,:u)');
            $stmt->execute([
                ':uid' => (int)$user['id'],
                ':v' => $valor,
                ':pix' => $pix,
                ':nome' => $nomeSolicitante,
                ':meta' => json_encode(['nome_solicitante' => $nomeSolicitante], JSON_UNESCAPED_UNICODE),
                ':c' => $agora,
                ':u' => $agora,
            ]);

            $saqueId = (int)$this->pdo->lastInsertId();
            $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'saque_afiliado\',:v,\'pendente\',:ref,\'{}\',:c)');
            $stmt->execute([
                ':uid' => (int)$user['id'],
                ':v' => $valor,
                ':ref' => 'SAQ-' . $saqueId,
                ':c' => $agora,
            ]);

            $newUser = $this->userService->byId((int)$user['id']);
            $this->pdo->commit();
            return ['status' => 'pendente', 'saldo_afiliado_novo' => (float)($newUser['saldo_afiliado'] ?? 0)];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
    public function meusSaques(array $user): array
    {
        $stmt = $this->pdo->prepare('SELECT id,tipo,valor,pix_chave,nome_solicitante,status,created_at FROM saques WHERE user_id=:uid ORDER BY id DESC LIMIT 100');
        $stmt->execute([':uid' => (int)$user['id']]);
        return ['saques' => $stmt->fetchAll() ?: []];
    }

    public function adminListSaques(string $status = 'pendente', int $pagina = 1, int $limite = 100, ?string $tipo = null): array
    {
        $pagina = max(1, $pagina);
        $limite = max(1, min(1000, $limite));
        $offset = ($pagina - 1) * $limite;

        $status = strtolower(trim($status));
        $params = [];
        $whereParts = [];
        if ($status !== '' && $status !== 'todos' && $status !== 'all') {
            $whereParts[] = 's.status = :status';
            $params[':status'] = $status;
        }
        $tipo = strtolower(trim((string)$tipo));
        if ($tipo !== '' && in_array($tipo, ['saque', 'saque_afiliado'], true)) {
            $whereParts[] = 's.tipo = :tipo';
            $params[':tipo'] = $tipo;
        }
        $where = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

        $sql = "SELECT s.id,s.user_id,s.tipo,s.valor,s.pix_chave,s.cpf,s.nome_solicitante,s.status,s.meta_json,s.created_at,s.updated_at,u.telefone,u.nome,u.apelido_admin
                FROM saques s
                INNER JOIN users u ON u.id = s.user_id
                {$where}
                ORDER BY s.id DESC
                LIMIT :lim OFFSET :off";
        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $limite, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll() ?: [];

        return ['saques' => $rows, 'pagina' => $pagina, 'limite' => $limite];
    }

    public function adminProcessarSaque(int $saqueId, string $acao, array $admin, string $motivo = ''): array
    {
        $acao = strtolower(trim($acao));
        if (!in_array($acao, ['aprovar', 'recusar'], true)) {
            throw new RuntimeException('Acao invalida.');
        }

        $stmt = $this->pdo->prepare('SELECT * FROM saques WHERE id=:id LIMIT 1');
        $stmt->execute([':id' => $saqueId]);
        $saque = $stmt->fetch();
        if (!$saque) {
            throw new RuntimeException('Saque nao encontrado.');
        }
        if ((string)$saque['status'] !== 'pendente') {
            throw new RuntimeException('Saque ja foi processado.');
        }

        $agora = Util::now();
        $meta = Util::jsonDecode((string)($saque['meta_json'] ?? ''), []);
        $meta['admin_action'] = $acao;
        $meta['admin_id'] = (int)($admin['id'] ?? 0);
        $meta['admin_telefone'] = (string)($admin['telefone'] ?? '');
        $meta['processed_at'] = $agora;
        if ($motivo !== '') {
            $meta['motivo'] = $motivo;
        }

        $this->pdo->beginTransaction();
        try {
            if ($acao === 'aprovar') {
                $statusPago = ((string)$saque['tipo'] === 'saque_afiliado') ? 'pago' : 'aprovado';
                $stmt = $this->pdo->prepare('UPDATE saques SET status=:s, meta_json=:m, updated_at=:u WHERE id=:id');
                $stmt->execute([
                    ':s' => $statusPago,
                    ':m' => json_encode($meta, JSON_UNESCAPED_UNICODE),
                    ':u' => $agora,
                    ':id' => $saqueId,
                ]);

                $transStatus = ((string)$saque['tipo'] === 'saque_afiliado') ? 'pago' : 'aprovado';
                $stmt = $this->pdo->prepare('UPDATE transacoes SET status=:s WHERE user_id=:uid AND referencia=:ref AND status=\'pendente\'');
                $stmt->execute([
                    ':s' => $transStatus,
                    ':uid' => (int)$saque['user_id'],
                    ':ref' => 'SAQ-' . $saqueId,
                ]);
            } else {
                // recusa: devolve saldo
                $field = ((string)$saque['tipo'] === 'saque_afiliado') ? 'saldo_afiliado' : 'saldo';
                $stmt = $this->pdo->prepare("UPDATE users SET {$field} = {$field} + :v, updated_at=:u WHERE id=:id");
                $stmt->execute([
                    ':v' => (float)$saque['valor'],
                    ':u' => $agora,
                    ':id' => (int)$saque['user_id'],
                ]);

                $stmt = $this->pdo->prepare('UPDATE saques SET status=\'recusado\', meta_json=:m, updated_at=:u WHERE id=:id');
                $stmt->execute([
                    ':m' => json_encode($meta, JSON_UNESCAPED_UNICODE),
                    ':u' => $agora,
                    ':id' => $saqueId,
                ]);

                $stmt = $this->pdo->prepare('UPDATE transacoes SET status=\'cancelado\' WHERE user_id=:uid AND referencia=:ref AND status=\'pendente\'');
                $stmt->execute([
                    ':uid' => (int)$saque['user_id'],
                    ':ref' => 'SAQ-' . $saqueId,
                ]);

                $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'estorno_saque\',:v,\'aprovado\',:ref,:m,:c)');
                $stmt->execute([
                    ':uid' => (int)$saque['user_id'],
                    ':v' => (float)$saque['valor'],
                    ':ref' => 'SAQ-' . $saqueId,
                    ':m' => json_encode(['tipo_original' => (string)$saque['tipo'], 'motivo' => $motivo], JSON_UNESCAPED_UNICODE),
                    ':c' => $agora,
                ]);
            }

            $u = $this->userService->byId((int)$saque['user_id']);
            $this->pdo->commit();

            return [
                'id' => (int)$saque['id'],
                'status' => $acao === 'aprovar' ? (((string)$saque['tipo'] === 'saque_afiliado') ? 'pago' : 'aprovado') : 'recusado',
                'user_id' => (int)$saque['user_id'],
                'saldo' => (float)($u['saldo'] ?? 0),
                'saldo_afiliado' => (float)($u['saldo_afiliado'] ?? 0),
            ];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function adminCreditarSaldo(int $userId, float $valor, string $alvo = 'saldo', string $motivo = '', array $admin = []): array
    {
        $valor = round($valor, 2);
        if ($valor <= 0) {
            throw new RuntimeException('Valor deve ser maior que zero.');
        }

        $alvo = strtolower(trim($alvo));
        if (!in_array($alvo, ['saldo', 'saldo_afiliado'], true)) {
            throw new RuntimeException('Alvo invalido.');
        }

        $u = $this->userService->byId($userId);
        if (!$u) {
            throw new RuntimeException('Usuario nao encontrado.');
        }

        $agora = Util::now();
        $meta = [
            'alvo' => $alvo,
            'motivo' => $motivo,
            'admin_id' => (int)($admin['id'] ?? 0),
            'admin_telefone' => (string)($admin['telefone'] ?? ''),
        ];

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("UPDATE users SET {$alvo} = {$alvo} + :v, updated_at=:u WHERE id=:id");
            $stmt->execute([
                ':v' => $valor,
                ':u' => $agora,
                ':id' => $userId,
            ]);

            $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'ajuste_admin\',:v,\'aprovado\',:ref,:m,:c)');
            $stmt->execute([
                ':uid' => $userId,
                ':v' => $valor,
                ':ref' => 'ADM-' . strtoupper(substr(md5($agora . '-' . $userId), 0, 10)),
                ':m' => json_encode($meta, JSON_UNESCAPED_UNICODE),
                ':c' => $agora,
            ]);

            $u = $this->userService->byId($userId);
            $this->pdo->commit();

            return [
                'user' => $u ? $this->userService->publicUser($u) : null,
                'valor_creditado' => $valor,
                'alvo' => $alvo,
            ];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function adminLimparSaldoComissao(int $userId, array $admin = [], string $motivo = ''): array
    {
        $u = $this->userService->byId($userId);
        if (!$u) {
            throw new RuntimeException('Usuario nao encontrado.');
        }

        $saldoAtual = round((float)($u['saldo_afiliado'] ?? 0), 2);
        if ($saldoAtual <= 0) {
            return [
                'user' => $this->userService->publicUser($u),
                'valor_limpado' => 0.0,
            ];
        }

        $agora = Util::now();
        $meta = [
            'alvo' => 'saldo_afiliado',
            'acao' => 'limpar_saldo_comissao',
            'motivo' => $motivo,
            'admin_id' => (int)($admin['id'] ?? 0),
            'admin_telefone' => (string)($admin['telefone'] ?? ''),
        ];

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE users SET saldo_afiliado = 0, updated_at=:u WHERE id=:id');
            $stmt->execute([
                ':u' => $agora,
                ':id' => $userId,
            ]);

            $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'ajuste_admin\',:v,\'aprovado\',:ref,:m,:c)');
            $stmt->execute([
                ':uid' => $userId,
                ':v' => -$saldoAtual,
                ':ref' => 'ADM-CLEAR-' . strtoupper(substr(md5($agora . '-' . $userId), 0, 8)),
                ':m' => json_encode($meta, JSON_UNESCAPED_UNICODE),
                ':c' => $agora,
            ]);

            $u2 = $this->userService->byId($userId);
            $this->pdo->commit();
            return [
                'user' => $u2 ? $this->userService->publicUser($u2) : null,
                'valor_limpado' => $saldoAtual,
            ];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function adminListPrimeiroDepositoBonus(int $pagina = 1, int $limite = 200): array
    {
        $pagina = max(1, $pagina);
        $limite = max(1, min(500, $limite));
        $offset = ($pagina - 1) * $limite;

        $sql = "SELECT
                    id, telefone, nome,
                    recebeu_bonus_primeiro_deposito,
                    primeiro_deposito_valor,
                    bonus_primeiro_deposito_valor,
                    primeiro_deposito_total_com_bonus,
                    rollover_exigido_bonus,
                    rollover_cumprido_bonus,
                    rollover_restante_bonus,
                    saque_liberado_bonus,
                    updated_at
                FROM users
                WHERE recebeu_bonus_primeiro_deposito = 1
                   OR rollover_exigido_bonus > 0
                   OR rollover_cumprido_bonus > 0
                ORDER BY id DESC
                LIMIT :lim OFFSET :off";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':lim', $limite, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll() ?: [];

        $result = array_map(function (array $r): array {
            $rolloverExigido = round((float)($r['rollover_exigido_bonus'] ?? 0), 2);
            $rolloverCumprido = round((float)($r['rollover_cumprido_bonus'] ?? 0), 2);
            $rolloverRestante = round((float)($r['rollover_restante_bonus'] ?? max(0, $rolloverExigido - $rolloverCumprido)), 2);
            $saqueLiberado = (int)($r['saque_liberado_bonus'] ?? ($rolloverRestante <= 0 ? 1 : 0)) === 1;

            return [
                'id' => (int)($r['id'] ?? 0),
                'telefone' => (string)($r['telefone'] ?? ''),
                'nome' => (string)($r['nome'] ?? ''),
                'recebeu_bonus_primeiro_deposito' => (int)($r['recebeu_bonus_primeiro_deposito'] ?? 0) === 1,
                'primeiro_deposito_valor' => round((float)($r['primeiro_deposito_valor'] ?? 0), 2),
                'bonus_primeiro_deposito_valor' => round((float)($r['bonus_primeiro_deposito_valor'] ?? 0), 2),
                'primeiro_deposito_total_com_bonus' => round((float)($r['primeiro_deposito_total_com_bonus'] ?? 0), 2),
                'rollover_exigido_bonus' => $rolloverExigido,
                'rollover_cumprido_bonus' => $rolloverCumprido,
                'rollover_restante_bonus' => $rolloverRestante,
                'saque_liberado_bonus' => $saqueLiberado,
                'status_rollover' => $saqueLiberado ? 'liberado' : 'bloqueado',
                'updated_at' => (string)($r['updated_at'] ?? ''),
            ];
        }, $rows);

        return ['usuarios' => $result, 'pagina' => $pagina, 'limite' => $limite];
    }

    public function processarWebhookDeposito(array $payload, array $query = []): array
    {
        // Auto-detect por estrutura do payload para nao depender do provider atual no admin.
        if (isset($payload['event']) && isset($payload['transaction']) && is_array($payload['transaction'])) {
            return $this->processarWebhookSigiloPay($payload, $query);
        }
        if (isset($payload['transactionType']) || isset($payload['transactionId'])) {
            return $this->processarWebhookEcopag($payload, $query);
        }

        $provider = strtolower((string)($this->configService->get('gateway', [])['provider'] ?? $this->config['payment']['provider'] ?? 'mock'));
        if (in_array($provider, ['ecompag', 'ecopag'], true)) {
            return $this->processarWebhookEcopag($payload, $query);
        }
        if (in_array($provider, ['sigilopay', 'sigilo'], true)) {
            return $this->processarWebhookSigiloPay($payload, $query);
        }
        if (in_array($provider, ['amplopay', 'amplo'], true)) {
            return $this->processarWebhookSigiloPay($payload, $query);
        }

        return ['ok' => true, 'processed' => false, 'reason' => 'provider_sem_webhook_implementado'];
    }

    private function processarWebhookEcopag(array $payload, array $query): array
    {
        $cfgSecret = (string)(($this->config['payment']['ecompag']['webhook_secret'] ?? '') ?: ($this->config['payment']['ecopag']['webhook_secret'] ?? ''));
        if ($cfgSecret !== '') {
            $incomingSecret = (string)($query['secret'] ?? '');
            if ($incomingSecret === '' || !hash_equals($cfgSecret, $incomingSecret)) {
                throw new RuntimeException('Webhook Ecopag nao autorizado.');
            }
        }

        $transactionType = strtoupper((string)($payload['transactionType'] ?? ''));
        $statusRaw = strtoupper((string)($payload['status'] ?? ''));
        $ref = (string)($payload['transactionId'] ?? '');
        $valor = (float)($payload['amount'] ?? 0);

        if ($transactionType !== '' && $transactionType !== 'RECEIVEPIX') {
            return ['ok' => true, 'processed' => false, 'reason' => 'evento_ignorado'];
        }

        if ($ref === '') {
            return ['ok' => true, 'processed' => false, 'reason' => 'transactionId_ausente'];
        }

        $stmt = $this->pdo->prepare('SELECT * FROM depositos WHERE txid=:r OR provider_ref=:r ORDER BY id DESC LIMIT 1');
        $stmt->execute([':r' => $ref]);
        $dep = $stmt->fetch();

        if (!$dep) {
            return ['ok' => true, 'processed' => false, 'reason' => 'deposito_nao_encontrado'];
        }

        $agora = Util::now();
        $metaAtual = Util::jsonDecode((string)($dep['meta_json'] ?? ''), []);
        $metaAtual['webhook_ecopag'] = $payload;
        $stmt = $this->pdo->prepare('UPDATE depositos SET meta_json=:m, updated_at=:u WHERE id=:id');
        $stmt->execute([
            ':m' => json_encode($metaAtual, JSON_UNESCAPED_UNICODE),
            ':u' => $agora,
            ':id' => (int)$dep['id'],
        ]);

        if ($statusRaw === 'PAID') {
            $saldoNovo = $this->aprovarDeposito((int)$dep['id'], $valor > 0 ? $valor : (float)$dep['valor']);
            return ['ok' => true, 'processed' => true, 'status' => 'aprovado', 'saldo_novo' => $saldoNovo];
        }

        if (in_array($statusRaw, ['FAILED', 'CANCELLED'], true)) {
            $stmt = $this->pdo->prepare('UPDATE depositos SET status=\'cancelado\', updated_at=:u WHERE id=:id');
            $stmt->execute([':u' => $agora, ':id' => (int)$dep['id']]);
            return ['ok' => true, 'processed' => true, 'status' => 'cancelado'];
        }

        return ['ok' => true, 'processed' => false, 'reason' => 'status_nao_final', 'status_recebido' => $statusRaw];
    }

    private function processarWebhookSigiloPay(array $payload, array $query): array
    {
        $tx = is_array($payload['transaction'] ?? null) ? $payload['transaction'] : [];
        $event = strtoupper((string)($payload['event'] ?? ''));
        $statusRaw = strtoupper((string)($tx['status'] ?? $payload['status'] ?? ''));
        $transactionId = (string)($tx['id'] ?? $payload['transactionId'] ?? '');
        $identifier = (string)($tx['identifier'] ?? $payload['identifier'] ?? '');
        $amount = (float)($tx['amount'] ?? $payload['amount'] ?? 0);
        $token = (string)($payload['token'] ?? '');

        $cfgSecret = (string)($this->config['payment']['sigilopay']['webhook_secret'] ?? ($this->config['payment']['amplopay']['webhook_secret'] ?? ''));
        if ($cfgSecret !== '') {
            $incomingSecret = (string)($query['secret'] ?? '');
            if ($incomingSecret === '' || !hash_equals($cfgSecret, $incomingSecret)) {
                throw new RuntimeException('Webhook SigiloPay nao autorizado.');
            }
        }

        $dep = $this->findDepositByRefs([$transactionId, $identifier]);
        if (!$dep) {
            return ['ok' => true, 'processed' => false, 'reason' => 'deposito_nao_encontrado'];
        }

        $metaAtual = Util::jsonDecode((string)($dep['meta_json'] ?? ''), []);
        if (!empty($metaAtual['webhook_token']) && $token !== '' && !hash_equals((string)$metaAtual['webhook_token'], $token)) {
            return ['ok' => true, 'processed' => false, 'reason' => 'token_webhook_invalido'];
        }

        $agora = Util::now();
        $metaAtual['webhook_sigilopay'] = $payload;
        $stmt = $this->pdo->prepare('UPDATE depositos SET meta_json=:m, updated_at=:u WHERE id=:id');
        $stmt->execute([
            ':m' => json_encode($metaAtual, JSON_UNESCAPED_UNICODE),
            ':u' => $agora,
            ':id' => (int)$dep['id'],
        ]);

        $isPaidEvent = in_array($event, ['TRANSACTION_PAID'], true);
        $isPaidStatus = $statusRaw === 'COMPLETED';
        if ($isPaidEvent || $isPaidStatus) {
            $saldoNovo = $this->aprovarDeposito((int)$dep['id'], $amount > 0 ? $amount : (float)$dep['valor']);
            return ['ok' => true, 'processed' => true, 'status' => 'aprovado', 'saldo_novo' => $saldoNovo];
        }

        if (in_array($event, ['TRANSACTION_CANCELED', 'TRANSACTION_REFUNDED'], true) || in_array($statusRaw, ['FAILED', 'REFUNDED', 'CHARGED_BACK', 'CANCELED', 'CANCELLED'], true)) {
            $stmt = $this->pdo->prepare('UPDATE depositos SET status=\'cancelado\', updated_at=:u WHERE id=:id');
            $stmt->execute([':u' => $agora, ':id' => (int)$dep['id']]);
            return ['ok' => true, 'processed' => true, 'status' => 'cancelado'];
        }

        return ['ok' => true, 'processed' => false, 'reason' => 'status_nao_final', 'event' => $event, 'status_recebido' => $statusRaw];
    }

    private function findDepositByRefs(array $refs): ?array
    {
        $refs = array_values(array_filter(array_map(fn($v) => trim((string)$v), $refs), fn($v) => $v !== ''));
        foreach ($refs as $ref) {
            $stmt = $this->pdo->prepare('SELECT * FROM depositos WHERE txid=:r OR provider_ref=:r ORDER BY id DESC LIMIT 1');
            $stmt->execute([':r' => $ref]);
            $dep = $stmt->fetch();
            if ($dep) {
                return $dep;
            }
        }

        if (empty($refs)) {
            return null;
        }

        $stmt = $this->pdo->prepare('SELECT * FROM depositos ORDER BY id DESC LIMIT 300');
        $stmt->execute();
        $rows = $stmt->fetchAll() ?: [];
        foreach ($rows as $row) {
            $meta = Util::jsonDecode((string)($row['meta_json'] ?? ''), []);
            $identifier = (string)($meta['identifier'] ?? $meta['external_reference'] ?? '');
            if ($identifier !== '' && in_array($identifier, $refs, true)) {
                return $row;
            }
        }

        return null;
    }
}

