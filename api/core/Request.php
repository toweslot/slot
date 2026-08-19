<?php

declare(strict_types=1);

namespace App\Core;

final class Request
{
    public static function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public static function path(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '/api/index.php';
        $scriptDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
        $pathN = str_replace('\\', '/', $path);

        if ($scriptDir !== '' && $scriptDir !== '/' && str_starts_with($pathN, $scriptDir)) {
            $pathN = substr($pathN, strlen($scriptDir));
        }

        $pathN = '/' . ltrim($pathN, '/');
        if ($pathN === '/index.php') {
            $pathN = '/';
        }

        return rtrim($pathN, '/') ?: '/';
    }

    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        if (!$raw) {
            return is_array($_POST) ? $_POST : [];
        }
        $data = json_decode($raw, true);
        if (is_array($data)) {
            return $data;
        }

        parse_str($raw, $parsed);
        if (is_array($parsed) && !empty($parsed)) {
            return $parsed;
        }

        return is_array($_POST) ? $_POST : [];
    }

    public static function query(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    public static function bearerToken(): ?string
    {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? '';
        if (!$auth && function_exists('getallheaders')) {
            $headers = getallheaders();
            $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (preg_match('/Bearer\s+(.+)/i', (string)$auth, $m)) {
            return trim($m[1]);
        }
        return null;
    }
}

