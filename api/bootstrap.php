<?php

declare(strict_types=1);

use App\Core\Env;
use App\Core\Database;
use App\Core\SchemaUpgrader;

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $parts = explode('\\', $relative);
    $file = array_pop($parts);
    $dir = implode(DIRECTORY_SEPARATOR, array_map('strtolower', $parts));
    $path = __DIR__ . DIRECTORY_SEPARATOR . ($dir ? $dir . DIRECTORY_SEPARATOR : '') . $file . '.php';
    if (is_file($path)) {
        require_once $path;
    }
});

$rootPath = dirname(__DIR__);
Env::load($rootPath);

$config = require __DIR__ . '/config/config.php';
$pdo = Database::conn($config);
SchemaUpgrader::ensure($pdo);

return [$config, $pdo];

