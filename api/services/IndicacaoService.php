<?php

declare(strict_types=1);

namespace App\Services;

use PDO;

final class IndicacaoService
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly ConfigService $configService,
        private readonly array $config
    ) {
    }

    public function info(array $user): array
    {
        $uid = (int)$user['id'];

        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM users WHERE convidado_por_id=:uid');
        $stmt->execute([':uid' => $uid]);
        $totalIndicados = (int)($stmt->fetch()['c'] ?? 0);

        // Só conta indicados/montantes cujo depósito gerou comissão para este usuário
        $stmt = $this->pdo->prepare("SELECT COUNT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(meta_json,'$.user_id_indicado'))) AS c
                                     FROM transacoes
                                     WHERE user_id=:uid AND tipo='bonus_indicacao' AND status='aprovado'");
        $stmt->execute([':uid' => $uid]);
        $totalComDeposito = (int)($stmt->fetch()['c'] ?? 0);

        $stmt = $this->pdo->prepare("SELECT COALESCE(SUM(t.valor),0) AS s
                                     FROM transacoes t
                                     JOIN transacoes b ON b.referencia = t.referencia
                                       AND b.tipo='bonus_indicacao' AND b.status='aprovado' AND b.user_id=:uid
                                     WHERE t.tipo='deposito' AND t.status='aprovado'");
        $stmt->execute([':uid' => $uid]);
        $montanteDepositos = (float)($stmt->fetch()['s'] ?? 0);

        $stmt = $this->pdo->prepare('SELECT COALESCE(SUM(valor),0) AS s FROM transacoes WHERE user_id=:uid AND tipo=\'bonus_indicacao\' AND status=\'aprovado\'');
        $stmt->execute([':uid' => $uid]);
        $totalComissao = (float)($stmt->fetch()['s'] ?? 0);

        $stmt = $this->pdo->prepare('SELECT id,nome,created_at FROM users WHERE convidado_por_id=:uid ORDER BY id DESC LIMIT 20');
        $stmt->execute([':uid' => $uid]);
        $indicados = $stmt->fetchAll() ?: [];

        $qBonus = $this->pdo->prepare('SELECT valor, meta_json FROM transacoes WHERE user_id=:uid AND tipo=\'bonus_indicacao\' AND status=\'aprovado\'');
        $qBonus->execute([':uid' => $uid]);
        $bonusRows = $qBonus->fetchAll() ?: [];

        $stmt = $this->pdo->prepare("SELECT id,valor,pix_chave,nome_solicitante,status,created_at,updated_at
                                     FROM saques
                                     WHERE user_id=:uid AND tipo='saque_afiliado'
                                     ORDER BY id DESC
                                     LIMIT 100");
        $stmt->execute([':uid' => $uid]);
        $saquesAfilRows = $stmt->fetchAll() ?: [];

        $recentes = [];
        foreach ($indicados as $i) {
            $q = $this->pdo->prepare('SELECT COUNT(*) AS c, COALESCE(SUM(valor),0) AS t FROM transacoes WHERE user_id=:id AND tipo=\'deposito\' AND status=\'aprovado\'');
            $q->execute([':id' => (int)$i['id']]);
            $depData = $q->fetch() ?: [];
            $depCount = (int)($depData['c'] ?? 0);
            $depTotal = round((float)($depData['t'] ?? 0), 2);
            $comissUser = 0.0;
            foreach ($bonusRows as $r) {
                $meta = json_decode((string)($r['meta_json'] ?? '{}'), true) ?: [];
                if ((int)($meta['user_id_indicado'] ?? 0) === (int)$i['id']) {
                    $comissUser += (float)($r['valor'] ?? 0);
                }
            }

            // Só considera "pago" quando a comissão foi efetivamente creditada
            // (a cada 3 indicados, apenas o 3º conta; 1º e 2º ficam para o site).
            $depOk = $comissUser > 0;

            $recentes[] = [
                'nome' => $i['nome'] ?: 'Usuario #' . $i['id'],
                'data_cadastro' => $i['created_at'],
                'nivel_afil' => 1,
                'bonus_pago' => $depOk,
                'status_deposito' => $depOk ? 'pago' : 'nao_pago',
                'qtd_depositos' => $depOk ? $depCount : 0,
                'total_depositado' => $depOk ? $depTotal : 0.0,
                'total_comissao_indicado' => $comissUser,
            ];
        }

        $cfg = $this->configService->get('indicacao', []);
        $bonusCfg = $this->configService->get('bonus_primeiro_deposito', []);
        $bonusModoRaw = strtolower(trim((string)($bonusCfg['modo_aplicacao'] ?? $bonusCfg['apply_mode'] ?? 'primeiro_deposito')));
        $bonusModo = in_array($bonusModoRaw, ['sempre', 'always'], true) ? 'sempre' : 'primeiro_deposito';
        $gameCfg = $this->configService->get('game', []);
        $saqueMinimoComissao = max(50.0, (float)($gameCfg['saque_afiliado_minimo'] ?? 50));

        $bonusRecebido = (int)($user['recebeu_bonus_primeiro_deposito'] ?? 0) === 1;
        $primeiroDeposito = round((float)($user['primeiro_deposito_valor'] ?? 0), 2);
        $bonusValor = round((float)($user['bonus_primeiro_deposito_valor'] ?? 0), 2);
        $totalComBonus = round((float)($user['primeiro_deposito_total_com_bonus'] ?? 0), 2);
        $rolloverExigido = round((float)($user['rollover_exigido_bonus'] ?? 0), 2);
        $rolloverCumprido = round((float)($user['rollover_cumprido_bonus'] ?? 0), 2);
        $rolloverRestante = round((float)($user['rollover_restante_bonus'] ?? max(0, $rolloverExigido - $rolloverCumprido)), 2);
        $saqueLiberadoBonus = (int)($user['saque_liberado_bonus'] ?? ($rolloverRestante <= 0 ? 1 : 0)) === 1;
        if (!$bonusRecebido) {
            $rolloverRestante = 0;
            $saqueLiberadoBonus = true;
        }

        $comissaoPadrao = (float)($cfg['comissao_nivel1_perc'] ?? 5);
        $comissaoCustom = null;
        if (array_key_exists('comissao_indicacao_perc', $user) && $user['comissao_indicacao_perc'] !== null && $user['comissao_indicacao_perc'] !== '') {
            $comissaoCustom = (float)$user['comissao_indicacao_perc'];
        }
        $comissaoEfetiva = ($comissaoCustom !== null && $comissaoCustom > 0) ? $comissaoCustom : $comissaoPadrao;

        $sumPendente = 0.0;
        $sumPago = 0.0;
        $sumRecusado = 0.0;
        $countPendente = 0;
        $countPago = 0;
        $countRecusado = 0;
        $saquesAfiliado = [];

        foreach ($saquesAfilRows as $r) {
            $statusRaw = strtolower((string)($r['status'] ?? 'pendente'));
            $status = $statusRaw;
            if ($statusRaw === 'aprovado') {
                $status = 'pago';
            } elseif (!in_array($statusRaw, ['pendente', 'pago', 'recusado'], true)) {
                $status = 'pendente';
            }

            $valor = (float)($r['valor'] ?? 0);
            if ($status === 'pendente') {
                $sumPendente += $valor;
                $countPendente++;
            } elseif ($status === 'pago') {
                $sumPago += $valor;
                $countPago++;
            } elseif ($status === 'recusado') {
                $sumRecusado += $valor;
                $countRecusado++;
            }

            $saquesAfiliado[] = [
                'id' => (int)($r['id'] ?? 0),
                'valor' => $valor,
                'pix_chave' => (string)($r['pix_chave'] ?? ''),
                'nome_solicitante' => (string)($r['nome_solicitante'] ?? ''),
                'status' => $status,
                'created_at' => (string)($r['created_at'] ?? ''),
                'updated_at' => (string)($r['updated_at'] ?? ''),
            ];
        }

        return [
            'link' => rtrim((string)$this->config['app']['url'], '/') . '/#landing?ref=' . urlencode((string)$user['codigo_indicacao']),
            'total_indicados' => $totalIndicados,
            'total_com_deposito' => $totalComDeposito,
            'saldo_afiliado' => (float)($user['saldo_afiliado'] ?? 0),
            'total_comissao' => $totalComissao,
            'montante_depositos' => $montanteDepositos,
            'indicados_recentes' => $recentes,
            'saque_afiliado_minimo' => $saqueMinimoComissao,
            'saques_afiliado' => $saquesAfiliado,
            'resumo_saques_afiliado' => [
                'pendente' => ['quantidade' => $countPendente, 'valor' => $sumPendente],
                'pago' => ['quantidade' => $countPago, 'valor' => $sumPago],
                'recusado' => ['quantidade' => $countRecusado, 'valor' => $sumRecusado],
            ],
            'bonus_primeiro_deposito' => [
                'enabled' => (bool)($bonusCfg['enabled'] ?? true),
                'modo_aplicacao' => $bonusModo,
                'percentual_bonus' => (float)($bonusCfg['percentual_bonus'] ?? 100),
                'rollover_multiplicador' => (float)($bonusCfg['rollover_multiplicador'] ?? 3),
                'recebeu_bonus_primeiro_deposito' => $bonusRecebido,
                'primeiro_deposito_valor' => $primeiroDeposito,
                'bonus_recebido_valor' => $bonusValor,
                'total_com_bonus' => $totalComBonus,
                'rollover_necessario' => $rolloverExigido,
                'rollover_cumprido' => $rolloverCumprido,
                'rollover_restante' => $rolloverRestante,
                'saque_liberado' => $saqueLiberadoBonus,
                'status_saque' => $saqueLiberadoBonus ? 'liberado' : 'bloqueado',
            ],

            'comissao_nivel1_perc' => (float)($cfg['comissao_nivel1_perc'] ?? 5),
            'comissao_custom_perc' => $comissaoCustom,
            'comissao_efetiva_perc' => $comissaoEfetiva,
            'show_comissao_banner' => (int)($cfg['show_comissao_banner'] ?? 1),
            'show_saldo_afiliado' => (int)($cfg['show_saldo_afiliado'] ?? 1),
            'show_botao_sacar_afil' => (int)($cfg['show_botao_sacar_afil'] ?? 1),
            'show_link_afiliado' => (int)($cfg['show_link_afiliado'] ?? 1),
            'show_stats_indicados' => (int)($cfg['show_stats_indicados'] ?? 1),
            'show_montante' => (int)($cfg['show_montante'] ?? 1),
            'show_lista_indicados' => (int)($cfg['show_lista_indicados'] ?? 1),
            'show_valor_comissao_lista' => (int)($cfg['show_valor_comissao_lista'] ?? 1),
        ];
    }
}

