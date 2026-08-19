<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use Throwable;

final class SchemaUpgrader
{
    private static bool $done = false;

    public static function ensure(PDO $pdo): void
    {
        if (self::$done) {
            return;
        }

        self::$done = true;
        try {
            $driver = (string)$pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'mysql') {
                self::ensureMysql($pdo);
                return;
            }
            if ($driver === 'sqlite') {
                self::ensureSqlite($pdo);
                return;
            }
        } catch (Throwable) {
            // non-fatal: keep app running even if schema auto-upgrade fails
        }
    }

    private static function hasMysqlColumn(PDO $pdo, string $table, string $column): bool
    {
        $stmt = $pdo->prepare("SHOW COLUMNS FROM `{$table}` LIKE :c");
        $stmt->execute([':c' => $column]);
        return (bool)$stmt->fetch();
    }

    private static function hasSqliteColumn(PDO $pdo, string $table, string $column): bool
    {
        $stmt = $pdo->query("PRAGMA table_info({$table})");
        $rows = $stmt ? ($stmt->fetchAll() ?: []) : [];
        foreach ($rows as $r) {
            if ((string)($r['name'] ?? '') === $column) {
                return true;
            }
        }
        return false;
    }

    private static function hasSqliteTable(PDO $pdo, string $table): bool
    {
        $stmt = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=:t LIMIT 1");
        $stmt->execute([':t' => $table]);
        return (bool)$stmt->fetch();
    }

    private static function ensureMysql(PDO $pdo): void
    {
        if (!self::hasMysqlColumn($pdo, 'users', 'apelido_admin')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `apelido_admin` VARCHAR(120) NOT NULL DEFAULT \'\' AFTER `nome`');
        }

        if (!self::hasMysqlColumn($pdo, 'users', 'comissao_indicacao_perc')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `comissao_indicacao_perc` DECIMAL(6,2) NULL DEFAULT NULL AFTER `is_influencer`');
        }

        if (!self::hasMysqlColumn($pdo, 'users', 'recebeu_bonus_primeiro_deposito')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `recebeu_bonus_primeiro_deposito` TINYINT(1) NOT NULL DEFAULT 0 AFTER `saldo_afiliado`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'primeiro_deposito_valor')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `primeiro_deposito_valor` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `recebeu_bonus_primeiro_deposito`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'bonus_primeiro_deposito_valor')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `bonus_primeiro_deposito_valor` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `primeiro_deposito_valor`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'primeiro_deposito_total_com_bonus')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `primeiro_deposito_total_com_bonus` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `bonus_primeiro_deposito_valor`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'rollover_exigido_bonus')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `rollover_exigido_bonus` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `primeiro_deposito_total_com_bonus`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'rollover_cumprido_bonus')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `rollover_cumprido_bonus` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `rollover_exigido_bonus`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'rollover_restante_bonus')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `rollover_restante_bonus` DECIMAL(14,2) NOT NULL DEFAULT 0.00 AFTER `rollover_cumprido_bonus`');
        }
        if (!self::hasMysqlColumn($pdo, 'users', 'saque_liberado_bonus')) {
            $pdo->exec('ALTER TABLE `users` ADD COLUMN `saque_liberado_bonus` TINYINT(1) NOT NULL DEFAULT 1 AFTER `rollover_restante_bonus`');
        }

        if (!self::hasMysqlColumn($pdo, 'saques', 'nome_solicitante')) {
            $pdo->exec('ALTER TABLE `saques` ADD COLUMN `nome_solicitante` VARCHAR(190) NOT NULL DEFAULT \'\' AFTER `cpf`');
        }
    }

    private static function ensureSqlite(PDO $pdo): void
    {
        // Se banco SQLite estiver vazio (ex.: .env ausente, arquivo novo),
        // cria estrutura base automaticamente para nao quebrar login/cadastro.
        if (!self::hasSqliteTable($pdo, 'users')) {
            $initFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'migrations' . DIRECTORY_SEPARATOR . '001_init.sql';
            if (is_file($initFile)) {
                $sql = (string)file_get_contents($initFile);
                if ($sql !== '') {
                    $pdo->exec($sql);
                }
            }
        }

        if (!self::hasSqliteTable($pdo, 'users') || !self::hasSqliteTable($pdo, 'saques')) {
            return;
        }

        if (!self::hasSqliteColumn($pdo, 'users', 'apelido_admin')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN apelido_admin TEXT NOT NULL DEFAULT \'\'');
        }

        if (!self::hasSqliteColumn($pdo, 'users', 'comissao_indicacao_perc')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN comissao_indicacao_perc REAL NULL');
        }

        if (!self::hasSqliteColumn($pdo, 'users', 'recebeu_bonus_primeiro_deposito')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN recebeu_bonus_primeiro_deposito INTEGER NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'primeiro_deposito_valor')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN primeiro_deposito_valor REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'bonus_primeiro_deposito_valor')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN bonus_primeiro_deposito_valor REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'primeiro_deposito_total_com_bonus')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN primeiro_deposito_total_com_bonus REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'rollover_exigido_bonus')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN rollover_exigido_bonus REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'rollover_cumprido_bonus')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN rollover_cumprido_bonus REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'rollover_restante_bonus')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN rollover_restante_bonus REAL NOT NULL DEFAULT 0');
        }
        if (!self::hasSqliteColumn($pdo, 'users', 'saque_liberado_bonus')) {
            $pdo->exec('ALTER TABLE users ADD COLUMN saque_liberado_bonus INTEGER NOT NULL DEFAULT 1');
        }

        if (!self::hasSqliteColumn($pdo, 'saques', 'nome_solicitante')) {
            $pdo->exec('ALTER TABLE saques ADD COLUMN nome_solicitante TEXT NOT NULL DEFAULT \'\'');
        }
    }
}
