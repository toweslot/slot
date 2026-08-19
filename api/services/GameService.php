<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;
use RuntimeException;

final class GameService
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly ConfigService $configService,
        private readonly UserService $userService
    ) {
    }

    private function influencerMetaMultiplicador(array $cfg): float
    {
        $mult = (float)($cfg['influencer_meta_multiplicador'] ?? 3);
        return $mult > 0 ? $mult : 3.0;
    }

    private function influencerPayoutMultiplicador(array $cfg): float
    {
        $mult = (float)($cfg['influencer_payout_multiplicador'] ?? 5);
        return $mult > 0 ? $mult : 5.0;
    }

    private function influencerEasyUsers(array $cfg): array
    {
        $raw = $cfg['influencer_easy_users'] ?? [];
        if (!is_array($raw)) {
            return [];
        }

        return array_values(array_unique(array_map(
            static fn($v) => (int)$v,
            array_filter($raw, static fn($v) => (int)$v > 0)
        )));
    }

    private function isInfluencerEasy(array $user, array $cfg): bool
    {
        if ((int)($user['is_influencer'] ?? 0) !== 1) {
            return false;
        }
        if (!(bool)($cfg['influencer_mode'] ?? true)) {
            return false;
        }

        if (!array_key_exists('influencer_easy_users', $cfg)) {
            // backward compatibility: no list configured = all influencers are easy
            return true;
        }

        $easyUsers = $this->influencerEasyUsers($cfg);
        return in_array((int)$user['id'], $easyUsers, true);
    }

    private function multInicial(array $cfg): float
    {
        $v = (float)($cfg['multiplicador_inicial'] ?? 1);
        return $v > 0 ? $v : 1.0;
    }

    private function multIncremento(array $cfg): float
    {
        $v = (float)($cfg['multiplicador_incremento'] ?? 0.2);
        return $v > 0 ? $v : 0.2;
    }

    private function multMax(array $cfg): float
    {
        $v = (float)($cfg['multiplicador_max'] ?? 0);
        return $v > 0 ? $v : 0.0;
    }

    private function minAcertosSaque(array $cfg): int
    {
        $v = (int)($cfg['min_acertos_saque'] ?? 5);
        return $v > 0 ? $v : 5;
    }

    /** Multiplicador acumulado apos N acertos. */
    private function multPara(int $acertos, array $cfg): float
    {
        $m = $this->multInicial($cfg) + $acertos * $this->multIncremento($cfg);
        $max = $this->multMax($cfg);
        if ($max > 0) {
            $m = min($m, $max);
        }
        return round($m, 4);
    }

    public function getConfigs(?array $user = null): array
    {
        $cfg = $this->configService->get('game', []);
        $influencerMult = $this->influencerMetaMultiplicador($cfg);
        $influencerPayoutMult = $this->influencerPayoutMultiplicador($cfg);
        $isInfluencerBoosted = is_array($user)
            && (int)($user['is_influencer'] ?? 0) === 1
            && (bool)($cfg['influencer_mode'] ?? true);

        $multiplicador = (float)($cfg['multiplicador'] ?? 7);
        if (is_array($user) && (int)($user['is_influencer'] ?? 0) === 1) {
            $multiplicador = $influencerMult;
        }

        $multInc = $this->multIncremento($cfg);
        if ($isInfluencerBoosted) {
            $multInc = round($multInc * $influencerPayoutMult, 4);
        }

        return [
            'multiplicador' => $multiplicador,
            'dificuldade' => (string)($cfg['dificuldade'] ?? 'normal'),
            'entrada_valores_rapidos' => $cfg['entrada_valores_rapidos'] ?? [1, 2, 5, 10, 20, 50],
            'taxa_por_plataforma' => (float)($cfg['taxa_por_plataforma'] ?? 0.10),
            'payout_mode' => (string)($cfg['payout_mode'] ?? 'proporcional'),
            'payout_por_plataforma_fixo' => (float)($cfg['payout_por_plataforma_fixo'] ?? 0.05),
            'killer_chance_global' => (float)($cfg['killer_chance_global'] ?? 0.12),
            // Tower Slot: multiplicador progressivo
            'multiplicador_inicial' => $this->multInicial($cfg),
            'multiplicador_incremento' => $multInc,
            'multiplicador_max' => $this->multMax($cfg),
            'min_acertos_saque' => $this->minAcertosSaque($cfg),
            'influencer_mode' => (bool)($cfg['influencer_mode'] ?? true),
            'influencer_meta_multiplicador' => $influencerMult,
            'influencer_payout_multiplicador' => $influencerPayoutMult,
            'influencer_payout_ativo' => $isInfluencerBoosted ? 1 : 0,
            'influencer_easy_all' => !array_key_exists('influencer_easy_users', $cfg),
            'influencer_easy_users' => $this->influencerEasyUsers($cfg),
        ];
    }

    public function iniciar(array $user, float $valorEntrada, ?float $multiplicadorMeta = null): array
    {
        if ($valorEntrada < 1) {
            throw new RuntimeException('Valor minimo de entrada: R$ 1,00');
        }

        $saldo = (float)$user['saldo'];
        if ($saldo < $valorEntrada) {
            throw new RuntimeException('Saldo insuficiente.');
        }

        $cfg = $this->getConfigs($user);

        $isInfluencer = (int)($user['is_influencer'] ?? 0) === 1;
        if ($isInfluencer) {
            // forced by business rule
            $mult = $this->influencerMetaMultiplicador($cfg);
        } else {
            $mult = $multiplicadorMeta && $multiplicadorMeta > 0
                ? $multiplicadorMeta
                : (float)($cfg['multiplicador'] ?? 7);
        }

        $payoutMode = strtolower((string)$cfg['payout_mode']);
        $vpp = $payoutMode === 'fixed'
            ? (float)$cfg['payout_por_plataforma_fixo']
            : (float)$valorEntrada * (float)$cfg['taxa_por_plataforma'];

        $isInfluencerPayoutBoosted = $isInfluencer && (bool)($cfg['influencer_mode'] ?? true);
        if ($isInfluencerPayoutBoosted) {
            $vpp *= $this->influencerPayoutMultiplicador($cfg);
        }

        $isInfluencerEasy = $this->isInfluencerEasy($user, $cfg);

        $dificuldade = (string)$cfg['dificuldade'];
        $killerChance = (float)$cfg['killer_chance_global'];

        if ($isInfluencerEasy) {
            $dificuldade = 'influencer_normal';
            $killerChance = min(0.08, max(0.02, $killerChance * 0.55));
        }

        $partidaId = Util::uuid();
        $agora = Util::now();

        $valorMeta = round($valorEntrada * $mult, 2);
        $vpp = round($vpp, 4);

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE users SET saldo = saldo - :v, updated_at = :u WHERE id = :id');
            $stmt->execute([':v' => $valorEntrada, ':u' => $agora, ':id' => (int)$user['id']]);

            $stmt = $this->pdo->prepare('INSERT INTO partidas (id,user_id,valor_entrada,valor_meta,valor_por_plataforma,multiplicador_meta,dificuldade,killer_chance_override,plataformas_passadas,resgatou,status,valor_resultado,created_at,finalized_at)
                                        VALUES (:id,:user,:ve,:vm,:vpp,:mult,:dif,:kco,0,0,\'ativa\',0,:created,NULL)');
            $stmt->execute([
                ':id' => $partidaId,
                ':user' => (int)$user['id'],
                ':ve' => $valorEntrada,
                ':vm' => $valorMeta,
                ':vpp' => $vpp,
                ':mult' => $mult,
                ':dif' => $dificuldade,
                ':kco' => $killerChance,
                ':created' => $agora,
            ]);

            $stmt = $this->pdo->prepare('SELECT recebeu_bonus_primeiro_deposito, rollover_exigido_bonus, rollover_cumprido_bonus, rollover_restante_bonus, saque_liberado_bonus FROM users WHERE id=:id LIMIT 1');
            $stmt->execute([':id' => (int)$user['id']]);
            $roll = $stmt->fetch() ?: [];

            $recebeuBonus = (int)($roll['recebeu_bonus_primeiro_deposito'] ?? 0) === 1;
            $saqueLiberado = (int)($roll['saque_liberado_bonus'] ?? 1) === 1;
            $rollExigido = round((float)($roll['rollover_exigido_bonus'] ?? 0), 2);
            $rollCumprido = round((float)($roll['rollover_cumprido_bonus'] ?? 0), 2);

            if ($recebeuBonus && !$saqueLiberado && $rollExigido > 0) {
                $novoCumprido = round(min($rollExigido, $rollCumprido + $valorEntrada), 2);
                $novoRestante = round(max(0, $rollExigido - $novoCumprido), 2);
                $liberadoAgora = $novoRestante <= 0 ? 1 : 0;

                $stmt = $this->pdo->prepare('UPDATE users SET rollover_cumprido_bonus=:c, rollover_restante_bonus=:r, saque_liberado_bonus=:l, updated_at=:u WHERE id=:id');
                $stmt->execute([
                    ':c' => $novoCumprido,
                    ':r' => $novoRestante,
                    ':l' => $liberadoAgora,
                    ':u' => $agora,
                    ':id' => (int)$user['id'],
                ]);
            }

            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return [
            'partida_id' => $partidaId,
            'valor_meta' => $valorMeta,
            'valor_por_plataforma' => $vpp,
            'dificuldade' => $dificuldade,
            'is_influencer' => $isInfluencer ? 1 : 0,
            'influencer_easy' => $isInfluencerEasy ? 1 : 0,
            'killer_chance_override' => $killerChance,
            'multiplicador_inicial' => (float)$cfg['multiplicador_inicial'],
            'multiplicador_incremento' => (float)$cfg['multiplicador_incremento'],
            'multiplicador_max' => (float)$cfg['multiplicador_max'],
            'min_acertos_saque' => (int)$cfg['min_acertos_saque'],
        ];
    }

    public function finalizar(array $user, string $partidaId, int $plataformasPassadas, bool $resgatou): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM partidas WHERE id=:id AND user_id=:uid LIMIT 1');
        $stmt->execute([':id' => $partidaId, ':uid' => (int)$user['id']]);
        $p = $stmt->fetch();

        if (!$p) {
            throw new RuntimeException('Partida nao encontrada.');
        }
        if ((string)$p['status'] !== 'ativa') {
            throw new RuntimeException('Partida ja finalizada.');
        }

        $plataformasPassadas = max(0, $plataformasPassadas);
        $valorEntrada = (float)$p['valor_entrada'];
        $cfg = $this->getConfigs($user);
        $minAcertos = $this->minAcertosSaque($cfg);

        // Saque so e permitido a partir do minimo de acertos configurado
        if ($resgatou && $plataformasPassadas < $minAcertos) {
            throw new RuntimeException('Voce so pode sacar depois de ' . $minAcertos . ' acertos.');
        }

        $multiplicador = $this->multPara($plataformasPassadas, $cfg);
        $valorResultado = $resgatou ? round($valorEntrada * $multiplicador, 2) : $valorEntrada;

        $agora = Util::now();

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('UPDATE partidas SET plataformas_passadas=:pp,resgatou=:r,status=\'finalizada\',valor_resultado=:vr,finalized_at=:f WHERE id=:id');
            $stmt->execute([
                ':pp' => $plataformasPassadas,
                ':r' => $resgatou ? 1 : 0,
                ':vr' => $valorResultado,
                ':f' => $agora,
                ':id' => $partidaId,
            ]);

            if ($resgatou) {
                $stmt = $this->pdo->prepare('UPDATE users SET saldo = saldo + :v, total_partidas = total_partidas + 1, updated_at=:u WHERE id=:id');
                $stmt->execute([':v' => $valorResultado, ':u' => $agora, ':id' => (int)$user['id']]);

                $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'ganho_partida\',:v,\'aprovado\',:ref,:meta,:c)');
                $stmt->execute([
                    ':uid' => (int)$user['id'],
                    ':v' => $valorResultado,
                    ':ref' => $partidaId,
                    ':meta' => json_encode(['acertos' => $plataformasPassadas, 'multiplicador' => $multiplicador], JSON_UNESCAPED_UNICODE),
                    ':c' => $agora,
                ]);
            } else {
                $stmt = $this->pdo->prepare('UPDATE users SET total_partidas = total_partidas + 1, updated_at=:u WHERE id=:id');
                $stmt->execute([':u' => $agora, ':id' => (int)$user['id']]);

                $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'perda_partida\',:v,\'aprovado\',:ref,:meta,:c)');
                $stmt->execute([
                    ':uid' => (int)$user['id'],
                    ':v' => $valorEntrada,
                    ':ref' => $partidaId,
                    ':meta' => json_encode(['plataformas' => $plataformasPassadas], JSON_UNESCAPED_UNICODE),
                    ':c' => $agora,
                ]);
            }

            $novo = $this->userService->byId((int)$user['id']);
            $this->pdo->commit();

            return [
                'partida_id' => $partidaId,
                'resgatou' => $resgatou,
                'plataformas_passadas' => $plataformasPassadas,
                'multiplicador' => $multiplicador,
                'valor_ganho_ou_perdido' => $valorResultado,
                'saldo_novo' => (float)($novo['saldo'] ?? 0),
            ];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
