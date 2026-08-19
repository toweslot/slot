<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;
use RuntimeException;

final class CouponService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function validar(array $user, string $codigo): array
    {
        $codigo = strtoupper(trim($codigo));
        if ($codigo === '') {
            throw new RuntimeException('Código inválido.');
        }

        $stmt = $this->pdo->prepare('SELECT * FROM cupons WHERE codigo=:c LIMIT 1');
        $stmt->execute([':c' => $codigo]);
        $cupom = $stmt->fetch();

        if (!$cupom || (int)$cupom['ativo'] !== 1) {
            throw new RuntimeException('Cupom inválido ou inativo.');
        }

        if ((int)$cupom['uso_maximo'] > 0 && (int)$cupom['usos'] >= (int)$cupom['uso_maximo']) {
            throw new RuntimeException('Cupom esgotado.');
        }

        $stmt = $this->pdo->prepare('SELECT 1 FROM cupons_usos WHERE cupom_id=:cid AND user_id=:uid LIMIT 1');
        $stmt->execute([':cid' => (int)$cupom['id'], ':uid' => (int)$user['id']]);
        if ($stmt->fetch()) {
            throw new RuntimeException('Cupom já utilizado nesta conta.');
        }

        return [
            'codigo' => $codigo,
            'tipo' => (string)$cupom['tipo'],
            'valor' => (float)$cupom['valor'],
        ];
    }

    public function resgatar(array $user, string $codigo): array
    {
        $valid = $this->validar($user, $codigo);

        $stmt = $this->pdo->prepare('SELECT * FROM cupons WHERE codigo=:c LIMIT 1');
        $stmt->execute([':c' => $valid['codigo']]);
        $cupom = $stmt->fetch();

        $agora = Util::now();

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('INSERT INTO cupons_usos (cupom_id,user_id,created_at) VALUES (:cid,:uid,:c)');
            $stmt->execute([
                ':cid' => (int)$cupom['id'],
                ':uid' => (int)$user['id'],
                ':c' => $agora,
            ]);

            $stmt = $this->pdo->prepare('UPDATE cupons SET usos = usos + 1 WHERE id=:id');
            $stmt->execute([':id' => (int)$cupom['id']]);

            if ($valid['tipo'] === 'saldo') {
                $stmt = $this->pdo->prepare('UPDATE users SET saldo = saldo + :v, updated_at=:u WHERE id=:id');
                $stmt->execute([':v' => (float)$valid['valor'], ':u' => $agora, ':id' => (int)$user['id']]);

                $stmt = $this->pdo->prepare('INSERT INTO transacoes (user_id,tipo,valor,status,referencia,meta_json,created_at) VALUES (:uid,\'ajuste_admin\',:v,\'aprovado\',:r,:m,:c)');
                $stmt->execute([
                    ':uid' => (int)$user['id'],
                    ':v' => (float)$valid['valor'],
                    ':r' => 'CUPOM-' . $valid['codigo'],
                    ':m' => json_encode(['cupom' => $valid['codigo']], JSON_UNESCAPED_UNICODE),
                    ':c' => $agora,
                ]);
            }

            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return $valid;
    }
}

