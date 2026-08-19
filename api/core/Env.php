<?php

declare(strict_types=1);

namespace App\Core;

final class Env
{
    private static array $data = [];
    private static bool $loaded = false;

    public static function load(string $rootPath): void
    {
        if (self::$loaded) {
            return;
        }

        $envFile = rtrim($rootPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($envFile)) {
            self::$loaded = true;
            return;
        }

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            $pos = strpos($line, '=');
            if ($pos === false) {
                continue;
            }

            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));

            if ($val !== '' && (($val[0] === '"' && str_ends_with($val, '"')) || ($val[0] === "'" && str_ends_with($val, "'")))) {
                $val = substr($val, 1, -1);
            }

            self::$data[$key] = $val;
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;
            putenv($key . '=' . $val);
        }

        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        if (array_key_exists($key, self::$data)) {
            return self::$data[$key];
        }
        $v = getenv($key);
        return $v !== false ? $v : $default;
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $v = strtolower((string)self::get($key, $default ? '1' : '0'));
        return in_array($v, ['1', 'true', 'yes', 'on'], true);
    }
}

