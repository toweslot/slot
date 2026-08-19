<?php

declare(strict_types=1);

namespace App\Core;

final class Util
{
    public static function now(): string
    {
        return date('Y-m-d H:i:s');
    }

    public static function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public static function randomRef(string $prefix = 'TX'): string
    {
        return $prefix . strtoupper(bin2hex(random_bytes(6)));
    }

    public static function jsonDecode(string $json, array $fallback = []): array
    {
        $d = json_decode($json, true);
        return is_array($d) ? $d : $fallback;
    }
}

