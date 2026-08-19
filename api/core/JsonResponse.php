<?php

declare(strict_types=1);

namespace App\Core;

final class JsonResponse
{
    public static function send(array $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function ok(array $data = []): never
    {
        self::send($data, 200);
    }

    public static function error(string $message, int $status = 400, array $extra = []): never
    {
        self::send(array_merge(['error' => $message], $extra), $status);
    }
}

