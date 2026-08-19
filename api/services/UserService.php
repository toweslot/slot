<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;

final class UserService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function byId(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id=:id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $u = $stmt->fetch();
        return $u ?: null;
    }

    public function byTelefone(string $telefone): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE telefone=:t LIMIT 1');
        $stmt->execute([':t' => $telefone]);
        $u = $stmt->fetch();
        return $u ?: null;
    }

    public function byIndicacao(string $codigo): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE codigo_indicacao=:c LIMIT 1');
        $stmt->execute([':c' => strtoupper(trim($codigo))]);
        $u = $stmt->fetch();
        return $u ?: null;
    }

    public function create(string $telefone, string $senha, ?string $codigoIndicacao = null): array
    {
        $agora = Util::now();
        $cod = strtoupper(substr(preg_replace('/\D+/', '', $telefone), -6));
        $cod = 'HW' . str_pad($cod, 6, '0', STR_PAD_LEFT) . random_int(10, 99);

        $convidado = null;
        if ($codigoIndicacao) {
            $ref = $this->byIndicacao($codigoIndicacao);
            $convidado = $ref['id'] ?? null;
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO users (nome,email,telefone,senha_hash,chave_pix,codigo_indicacao,convidado_por_id,is_admin,is_influencer,saldo,saldo_afiliado,total_partidas,saque_liberado_bonus,created_at,updated_at)
             VALUES (:nome,:email,:telefone,:senha_hash,:pix,:codigo,:convidado,0,0,0,0,0,0,:created,:updated)'
        );

        $stmt->execute([
            ':nome' => '',
            ':email' => '',
            ':telefone' => $telefone,
            ':senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
            ':pix' => '',
            ':codigo' => $cod,
            ':convidado' => $convidado,
            ':created' => $agora,
            ':updated' => $agora,
        ]);

        $id = (int)$this->pdo->lastInsertId();

        // Bonus de R$ 260 NAO eh creditado no cadastro.
        // Sera liberado apenas apos o primeiro deposito aprovado (FinanceService).

        return $this->byId($id) ?? [];
    }

    public function updatePix(int $userId, string $pix): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET chave_pix=:pix, updated_at=:u WHERE id=:id');
        $stmt->execute([':pix' => $pix, ':u' => Util::now(), ':id' => $userId]);
    }

    public function updateSenha(int $userId, string $senhaNova): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET senha_hash=:h, updated_at=:u WHERE id=:id');
        $stmt->execute([':h' => password_hash($senhaNova, PASSWORD_DEFAULT), ':u' => Util::now(), ':id' => $userId]);
    }

    public function updateFields(int $userId, array $fields): void
    {
        if (!$fields) return;
        $allowed = ['nome', 'apelido_admin', 'email', 'telefone', 'is_admin', 'is_influencer', 'comissao_indicacao_perc', 'saldo', 'saldo_afiliado', 'chave_pix'];

        $set = [];
        $params = [':id' => $userId, ':updated_at' => Util::now()];

        foreach ($fields as $k => $v) {
            if (!in_array($k, $allowed, true)) continue;
            $set[] = "$k = :$k";
            $params[":$k"] = $v;
        }
        if (!$set) return;

        $set[] = 'updated_at = :updated_at';
        $sql = 'UPDATE users SET ' . implode(', ', $set) . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
    }

    public function publicUser(array $u): array
    {
        return [
            'id' => (int)$u['id'],
            'nome' => (string)($u['nome'] ?? ''),
            'apelido_admin' => (string)($u['apelido_admin'] ?? ''),
            'email' => (string)($u['email'] ?? ''),
            'telefone' => (string)($u['telefone'] ?? ''),
            'chave_pix' => (string)($u['chave_pix'] ?? ''),
            'is_admin' => (int)($u['is_admin'] ?? 0),
            'is_influencer' => (int)($u['is_influencer'] ?? 0),
            'comissao_indicacao_perc' => isset($u['comissao_indicacao_perc']) && $u['comissao_indicacao_perc'] !== null ? (float)$u['comissao_indicacao_perc'] : null,
            'codigo_indicacao' => (string)($u['codigo_indicacao'] ?? ''),
            'saldo' => (float)($u['saldo'] ?? 0),
            'saldo_afiliado' => (float)($u['saldo_afiliado'] ?? 0),
            'recebeu_bonus_primeiro_deposito' => (int)($u['recebeu_bonus_primeiro_deposito'] ?? 0),
            'primeiro_deposito_valor' => (float)($u['primeiro_deposito_valor'] ?? 0),
            'bonus_primeiro_deposito_valor' => (float)($u['bonus_primeiro_deposito_valor'] ?? 0),
            'primeiro_deposito_total_com_bonus' => (float)($u['primeiro_deposito_total_com_bonus'] ?? 0),
            'rollover_exigido_bonus' => (float)($u['rollover_exigido_bonus'] ?? 0),
            'rollover_cumprido_bonus' => (float)($u['rollover_cumprido_bonus'] ?? 0),
            'rollover_restante_bonus' => (float)($u['rollover_restante_bonus'] ?? 0),
            'saque_liberado_bonus' => (int)($u['saque_liberado_bonus'] ?? 1),
            'total_partidas' => (int)($u['total_partidas'] ?? 0),
            'created_at' => (string)($u['created_at'] ?? ''),
        ];
    }

    public function listUsers(int $limit = 200): array
    {
        $limit = max(1, min($limit, 1000));
        $stmt = $this->pdo->query('SELECT * FROM users ORDER BY id DESC LIMIT ' . $limit);
        return $stmt->fetchAll() ?: [];
    }
}

