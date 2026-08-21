<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;

final class ConfigService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function get(string $key, array $default = []): array
    {
        $stmt = $this->pdo->prepare('SELECT `value` FROM configs WHERE `key`=:k LIMIT 1');
        $stmt->execute([':k' => $key]);
        $row = $stmt->fetch();
        if (!$row) {
            return $default;
        }
        return Util::jsonDecode((string)$row['value'], $default);
    }

    public function set(string $key, array $value): void
    {
        $json = json_encode($value, JSON_UNESCAPED_UNICODE);
        $driver = (string)$this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

        if ($driver === 'mysql') {
            $stmt = $this->pdo->prepare('INSERT INTO configs(`key`,`value`) VALUES(:k,:v) ON DUPLICATE KEY UPDATE `value`=:v2');
            $stmt->execute([':k' => $key, ':v' => $json, ':v2' => $json]);
            return;
        }

        $stmt = $this->pdo->prepare('INSERT INTO configs(`key`,`value`) VALUES(:k,:v) ON CONFLICT(`key`) DO UPDATE SET `value`=:v2');
        $stmt->execute([':k' => $key, ':v' => $json, ':v2' => $json]);
    }

    public function publicConfig(): array
    {
        $cfg = $this->get('public', []);

        $links = $this->pdo->query('SELECT nome,url,ordem FROM suporte_links WHERE ativo=1 ORDER BY ordem ASC, id ASC')->fetchAll();
        $cfg['suporte_links'] = $links ?: ($cfg['suporte_links'] ?? []);

        return $cfg;
    }
}

