<?php

declare(strict_types=1);

use App\Core\Env;

return [
    'app' => [
        'env' => Env::get('APP_ENV', 'local'),
        'debug' => Env::bool('APP_DEBUG', true),
        'url' => Env::get('APP_URL', 'http://localhost'),
        'secret' => Env::get('APP_SECRET', 'change-this-secret'),
    ],
    'db' => [
        'driver' => Env::get('DB_DRIVER', 'sqlite'),
        'path' => dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . Env::get('DB_PATH', 'api/storage/database.sqlite'),
        'host' => Env::get('DB_HOST', '127.0.0.1'),
        'port' => (int) Env::get('DB_PORT', 3306),
        'name' => Env::get('DB_NAME', ''),
        'user' => Env::get('DB_USER', ''),
        'pass' => Env::get('DB_PASS', ''),
        'charset' => Env::get('DB_CHARSET', 'utf8mb4'),
    ],
    'notificacoes' => [
        // Webhook opcional: recebe {event:"user.registered", ...} a cada cadastro.
        'lead_webhook_url' => Env::get('LEAD_WEBHOOK_URL', ''),
        'lead_webhook_token' => Env::get('LEAD_WEBHOOK_TOKEN', ''),
    ],
    'payment' => [
        'provider' => Env::get('PAYMENT_PROVIDER', 'mock'),
        'mercadopago' => [
            'access_token' => Env::get('MP_ACCESS_TOKEN', ''),
            'webhook_secret' => Env::get('MP_WEBHOOK_SECRET', ''),
        ],
        'ecompag' => [
            'base_url' => Env::get('ECOMPAG_BASE_URL', Env::get('ECOPAG_BASE_URL', 'https://api.ecompag.com/v2')),
            'api_key' => Env::get('ECOMPAG_API_KEY', Env::get('ECOPAG_API_KEY', '')),
            'client_id' => Env::get('ECOMPAG_CLIENT_ID', Env::get('ECOPAG_CLIENT_ID', '')),
            'client_secret' => Env::get('ECOMPAG_CLIENT_SECRET', Env::get('ECOPAG_CLIENT_SECRET', '')),
            'webhook_secret' => Env::get('ECOMPAG_WEBHOOK_SECRET', Env::get('ECOPAG_WEBHOOK_SECRET', '')),
        ],
        'sigilopay' => [
            'base_url' => Env::get('SIGILOPAY_BASE_URL', 'https://app.sigilopay.com.br/api/v1'),
            'public_key' => Env::get('SIGILOPAY_PUBLIC_KEY', ''),
            'secret_key' => Env::get('SIGILOPAY_SECRET_KEY', ''),
            'webhook_secret' => Env::get('SIGILOPAY_WEBHOOK_SECRET', ''),
            'create_pix_path' => Env::get('SIGILOPAY_CREATE_PIX_PATH', '/gateway/pix/receive'),
            'status_path' => Env::get('SIGILOPAY_STATUS_PATH', '/gateway/transactions?id={id}'),
        ],
        'amplopay' => [
            'base_url' => Env::get('AMPLOPAY_BASE_URL', 'https://app.amplopay.com/api/v1'),
            'public_key' => Env::get('AMPLOPAY_PUBLIC_KEY', 'arourogabriel_c3lmdl10newcgyed'),
            'secret_key' => Env::get('AMPLOPAY_SECRET_KEY', 'n7t9akvxy3jqn2juxt9h631n64d6oo6ipcrbcobcnuiw0iktsvfhhkqphqfm7yt0'),
            'webhook_secret' => Env::get('AMPLOPAY_WEBHOOK_SECRET', ''),
            'create_pix_path' => Env::get('AMPLOPAY_CREATE_PIX_PATH', '/gateway/pix/receive'),
            'status_path' => Env::get('AMPLOPAY_STATUS_PATH', '/gateway/transactions?id={id}'),
        ],
    ],
];

