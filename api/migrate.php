<?php

declare(strict_types=1);

[$config, $pdo] = require __DIR__ . '/bootstrap.php';

$driver = (string)$pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
$sqlFile = $driver === 'mysql'
    ? dirname(__DIR__) . '/database.sql'
    : __DIR__ . '/migrations/001_init.sql';

if (!is_file($sqlFile)) {
    throw new RuntimeException("Arquivo SQL nao encontrado: {$sqlFile}");
}

$sql = file_get_contents($sqlFile);
$pdo->exec($sql);

$now = date('Y-m-d H:i:s');

function cfgSet(PDO $pdo, string $key, array $value): void
{
    $json = json_encode($value, JSON_UNESCAPED_UNICODE);
    $driver = (string)$pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    if ($driver === 'mysql') {
        $stmt = $pdo->prepare('INSERT INTO configs(`key`,`value`) VALUES(:k,:v) ON DUPLICATE KEY UPDATE `value`=:v2');
        $stmt->execute([':k' => $key, ':v' => $json, ':v2' => $json]);
        return;
    }

    $stmt = $pdo->prepare('INSERT INTO configs(`key`,`value`) VALUES(:k,:v) ON CONFLICT(`key`) DO UPDATE SET `value`=:v2');
    $stmt->execute([':k' => $key, ':v' => $json, ':v2' => $json]);
}

$publicCfg = [
    'site_nome' => 'Tower Slot',
    'site_suporte' => '',
    'site_promo' => '',
    'site_logo_url' => null,
    'site_favicon_url' => null,
    'demo_mode' => true,
    'registro_aberto' => true,
    'manutencao' => false,
    'banners' => [],
    'suporte_links' => [],
    'cores' => [
        'cor_bg' => '#FFE4EE',
        'cor_bg2' => '#FFB3CB',
        'cor_pink' => '#FF6B9D',
        'cor_pink2' => '#FF8CC8',
        'cor_purple' => '#7c3aed',
        'cor_purple2' => '#a855f7',
        'cor_green' => '#22c55e',
        'cor_green2' => '#16a34a',
        'cor_red' => '#ef4444',
        'cor_text' => '#0f172a',
    ],
];

$gameCfg = [
    'multiplicador' => 7,
    'dificuldade' => 'normal',
    'entrada_valores_rapidos' => [1, 2, 5, 10, 20, 50],

    'payout_mode' => 'fixed',
    'taxa_por_plataforma' => 0.10,
    'payout_por_plataforma_fixo' => 0.05,

    // Ajuste global de risco; usado no kco quando nao ha override do usuario
    'killer_chance_global' => 0.12,

    // Tower Slot: multiplicador progressivo por acerto
    'multiplicador_inicial' => 1,
    'multiplicador_incremento' => 0.2,
    'multiplicador_max' => 0,
    'min_acertos_saque' => 5,

    // Se true, aplica regras de influencer para contas marcadas
    'influencer_mode' => true,
    // Meta fixa para influencer
    'influencer_meta_multiplicador' => 3,

    // Limites
    'deposito_minimo' => 15,
    'deposito_maximo' => 0,
    'saque_minimo' => 20,
    'saque_maximo' => 0,
    'saque_afiliado_minimo' => 50,
    'saque_afiliado_maximo' => 0,
];

$gatewayCfg = [
    'provider' => $config['payment']['provider'] ?? 'mock',
    'mercadopago' => ['enabled' => true],
    'ecompag' => ['enabled' => true],
    'sigilopay' => ['enabled' => true],
];

$indicacaoCfg = [
    'comissao_nivel1_perc' => 5,
    'bonus_deposito_indicado' => 0,
    'show_comissao_banner' => 1,
    'show_saldo_afiliado' => 1,
    'show_botao_sacar_afil' => 1,
    'show_link_afiliado' => 1,
    'show_stats_indicados' => 1,
    'show_montante' => 1,
    'show_lista_indicados' => 1,
    'show_valor_comissao_lista' => 1,
];

$bonusPrimeiroDepositoCfg = [
    'enabled' => true,
    'modo_aplicacao' => 'primeiro_deposito',
    'percentual_bonus' => 100,
    'rollover_multiplicador' => 3,
];

$depositoBonusCfg = [
    'temDireito' => false,
    'perc' => 50,
    'minimo' => 15,
    'maximo' => 0,
    'valores_rapidos' => [15, 20, 50, 100, 500, 1000],
    'dep_presets' => [
        ['valor' => 15, 'label' => '', 'estilo' => ''],
        ['valor' => 20, 'label' => 'POPULAR', 'estilo' => 'popular'],
        ['valor' => 50, 'label' => 'QUERIDO', 'estilo' => 'custom'],
        ['valor' => 100, 'label' => 'RECOMENDADO', 'estilo' => 'popular'],
        ['valor' => 500, 'label' => '+CHANCES', 'estilo' => 'bonus'],
        ['valor' => 1000, 'label' => 'VIP', 'estilo' => 'bonus'],
    ],
];

cfgSet($pdo, 'public', $publicCfg);
cfgSet($pdo, 'game', $gameCfg);
cfgSet($pdo, 'gateway', $gatewayCfg);
cfgSet($pdo, 'indicacao', $indicacaoCfg);
cfgSet($pdo, 'bonus_primeiro_deposito', $bonusPrimeiroDepositoCfg);
cfgSet($pdo, 'deposito_bonus', $depositoBonusCfg);

$check = $pdo->query('SELECT COUNT(*) AS c FROM users WHERE is_admin=1')->fetch();
if ((int)($check['c'] ?? 0) === 0) {
    $adminTel = getenv('ADMIN_TELEFONE') ?: '11999999999';
    $adminPass = getenv('ADMIN_SENHA') ?: 'admin123';

    $stmt = $pdo->prepare('INSERT INTO users (nome,email,telefone,senha_hash,codigo_indicacao,is_admin,is_influencer,saldo,saldo_afiliado,total_partidas,created_at,updated_at) VALUES (:nome,:email,:tel,:hash,:cod,1,0,0,0,0,:c,:u)');
    $stmt->execute([
        ':nome' => 'Administrador',
        ':email' => 'admin@local',
        ':tel' => $adminTel,
        ':hash' => password_hash($adminPass, PASSWORD_DEFAULT),
        ':cod' => 'ADMIN' . random_int(1000, 9999),
        ':c' => $now,
        ':u' => $now,
    ]);

    echo "Admin criado com telefone {$adminTel} e senha {$adminPass}\n";
}

$cupom = $pdo->query('SELECT COUNT(*) AS c FROM cupons')->fetch();
if ((int)($cupom['c'] ?? 0) === 0) {
    $stmt = $pdo->prepare('INSERT INTO cupons (codigo,ativo,tipo,valor,uso_maximo,usos,created_at) VALUES (:codigo,1,:tipo,:valor,0,0,:created)');
    $stmt->execute([
        ':codigo' => 'BEMVINDO10',
        ':tipo' => 'bonus_percentual',
        ':valor' => 10,
        ':created' => $now,
    ]);
}

if ($driver === 'mysql') {
    echo "Migracao concluida no MySQL ({$config['db']['name']})\n";
} else {
    echo "Migracao concluida em {$config['db']['path']}\n";
}
