<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\JsonResponse;
use App\Core\Request;

final class Auth
{
    private static function b64urlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64urlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }

    public static function createToken(array $payload, string $secret, int $ttlSeconds = 2592000): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $now = time();

        $payload['iat'] = $now;
        $payload['exp'] = $now + $ttlSeconds;

        $h = self::b64urlEncode(json_encode($header, JSON_UNESCAPED_UNICODE));
        $p = self::b64urlEncode(json_encode($payload, JSON_UNESCAPED_UNICODE));
        $sig = hash_hmac('sha256', $h . '.' . $p, $secret, true);

        return $h . '.' . $p . '.' . self::b64urlEncode($sig);
    }

    public static function decodeToken(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$h, $p, $s] = $parts;
        $expected = self::b64urlEncode(hash_hmac('sha256', $h . '.' . $p, $secret, true));
        if (!hash_equals($expected, $s)) {
            return null;
        }

        $payload = json_decode(self::b64urlDecode($p), true);
        if (!is_array($payload)) {
            return null;
        }

        if (($payload['exp'] ?? 0) < time()) {
            return null;
        }

        return $payload;
    }

    public static function requireUser(array $config): array
    {
        $token = Request::bearerToken();
        if (!$token) {
            JsonResponse::error('Sessão expirada.', 401);
        }

        $payload = self::decodeToken($token, (string)$config['app']['secret']);
        if (!$payload || empty($payload['uid'])) {
            JsonResponse::error('Sessão expirada.', 401);
        }

        return $payload;
    }

    public static function requireAdmin(array $config): array
    {
        $payload = self::requireUser($config);
        if (empty($payload['is_admin'])) {
            JsonResponse::error('Acesso negado.', 403);
        }
        return $payload;
    }
}

