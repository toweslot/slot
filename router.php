<?php

declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . $path;

if ($path !== '/' && is_file($file)) {
    return false;
}

if (str_starts_with($path, '/api/')) {
    require __DIR__ . '/api/index.php';
    return true;
}

if ($path === '/admin' || $path === '/admin/') {
    require __DIR__ . '/admin/index.html';
    return true;
}

if (str_starts_with($path, '/admin/')) {
    $adminFile = __DIR__ . $path;
    if (is_file($adminFile)) {
        return false;
    }
}

require __DIR__ . '/index.html';
return true;

