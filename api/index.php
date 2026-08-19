<?php

declare(strict_types=1);

use App\Core\Auth;
use App\Core\JsonResponse;
use App\Core\Request;
use App\Services\ConfigService;
use App\Services\CouponService;
use App\Services\EventoService;
use App\Services\FinanceService;
use App\Services\GameService;
use App\Services\IndicacaoService;
use App\Services\UserService;

[$config, $pdo] = require __DIR__ . '/bootstrap.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if (Request::method() === 'OPTIONS') {
    JsonResponse::send(['ok' => true], 200);
}

$cfgService = new ConfigService($pdo);
$userService = new UserService($pdo);
$gameService = new GameService($pdo, $cfgService, $userService);
$finService = new FinanceService($pdo, $config, $cfgService, $userService);
$couponService = new CouponService($pdo);
$indicacaoService = new IndicacaoService($pdo, $cfgService, $config);
$eventoService = new EventoService($pdo, $config);

$method = Request::method();
$path = Request::path();
$body = Request::json();

$normalizeTel = function (string $t): string {
    return preg_replace('/\D+/', '', $t);
};

$getAuthUser = function () use ($config, $userService): array {
    $payload = Auth::requireUser($config);
    $u = $userService->byId((int)$payload['uid']);
    if (!$u) {
        JsonResponse::error('Sessão expirada.', 401);
    }
    return $u;
};

$getAdminUser = function () use ($config, $userService): array {
    $payload = Auth::requireAdmin($config);
    $u = $userService->byId((int)$payload['uid']);
    if (!$u) {
        JsonResponse::error('Sessão expirada.', 401);
    }
    return $u;
};

$deepMerge = function (array $base, array $patch) use (&$deepMerge): array {
    foreach ($patch as $k => $v) {
        if (is_array($v) && isset($base[$k]) && is_array($base[$k])) {
            $base[$k] = $deepMerge($base[$k], $v);
        } else {
            $base[$k] = $v;
        }
    }
    return $base;
};

try {
    // Health
    if ($method === 'GET' && $path === '/') {
        JsonResponse::ok(['ok' => true, 'service' => 'towerslot-api', 'time' => date('c')]);
    }

    // Feed publico de eventos reais (cadastros, depositos aprovados)
    if ($method === 'GET' && $path === '/public/eventos') {
        $after = (int)($_GET['after'] ?? 0);
        JsonResponse::ok(['eventos' => $eventoService->recentes(12, $after)]);
    }

    // Public config
    if ($method === 'GET' && $path === '/public/config') {
        JsonResponse::ok($cfgService->publicConfig());
    }

    // AUTH
    if ($method === 'POST' && $path === '/auth/register') {
        $telefone = $normalizeTel((string)($body['telefone'] ?? ''));
        $senha = (string)($body['senha'] ?? '');
        $codigoIndicacao = trim((string)($body['codigo_indicacao'] ?? ''));

        if (strlen($telefone) < 10) {
            JsonResponse::error('Telefone inválido.', 422);
        }
        if (strlen($senha) < 6) {
            JsonResponse::error('Senha deve ter pelo menos 6 caracteres.', 422);
        }
        if ($userService->byTelefone($telefone)) {
            JsonResponse::error('Telefone já cadastrado.', 409);
        }

        $u = $userService->create($telefone, $senha, $codigoIndicacao ?: null);

        // Notificacao de cadastro: alimenta o feed da tela e avisa o gateway/CRM.
        $eventoService->cadastroRealizado($u);

        $token = Auth::createToken(['uid' => (int)$u['id'], 'is_admin' => (int)$u['is_admin']], (string)$config['app']['secret']);

        JsonResponse::ok(['token' => $token, 'user' => $userService->publicUser($u)]);
    }

    if ($method === 'POST' && $path === '/auth/login') {
        $telefone = $normalizeTel((string)($body['telefone'] ?? ''));
        $senha = (string)($body['senha'] ?? '');

        $u = $userService->byTelefone($telefone);
        if (!$u || !password_verify($senha, (string)$u['senha_hash'])) {
            JsonResponse::error('Telefone ou senha inválidos.', 401);
        }

        $token = Auth::createToken(['uid' => (int)$u['id'], 'is_admin' => (int)$u['is_admin']], (string)$config['app']['secret']);
        JsonResponse::ok(['token' => $token, 'user' => $userService->publicUser($u)]);
    }

    if ($method === 'GET' && $path === '/auth/me') {
        $u = $getAuthUser();
        JsonResponse::ok(['user' => $userService->publicUser($u)]);
    }

    // USER
    if ($method === 'GET' && $path === '/user/dashboard') {
        $u = $getAuthUser();
        JsonResponse::ok($finService->dashboard($u));
    }

    if ($method === 'PUT' && $path === '/user/pix') {
        $u = $getAuthUser();
        $pix = trim((string)($body['chave_pix'] ?? ''));
        if ($pix === '') {
            JsonResponse::error('Informe a chave PIX.', 422);
        }
        $userService->updatePix((int)$u['id'], $pix);
        JsonResponse::ok(['ok' => true]);
    }

    if ($method === 'PUT' && $path === '/user/senha') {
        $u = $getAuthUser();
        $atual = (string)($body['senha_atual'] ?? '');
        $nova = (string)($body['senha_nova'] ?? '');
        if (!password_verify($atual, (string)$u['senha_hash'])) {
            JsonResponse::error('Senha atual inválida.', 422);
        }
        if (strlen($nova) < 6) {
            JsonResponse::error('Senha nova deve ter no mínimo 6 caracteres.', 422);
        }
        $userService->updateSenha((int)$u['id'], $nova);
        JsonResponse::ok(['ok' => true]);
    }

    if ($method === 'GET' && $path === '/user/deposito-info') {
        JsonResponse::ok($finService->depositoInfo());
    }

    if ($method === 'GET' && $path === '/user/suporte') {
        $links = $pdo->query('SELECT nome,url,ordem FROM suporte_links WHERE ativo=1 ORDER BY ordem ASC, id ASC')->fetchAll() ?: [];
        if (!$links) {
            $pub = $cfgService->publicConfig();
            if (!empty($pub['site_suporte'])) {
                $links[] = ['nome' => 'WhatsApp', 'url' => $pub['site_suporte'], 'ordem' => 1];
            }
            foreach (($pub['suporte_links'] ?? []) as $s) {
                $links[] = ['nome' => $s['nome'] ?? 'Suporte', 'url' => $s['url'] ?? '#', 'ordem' => $s['ordem'] ?? 99];
            }
        }
        if (!$links) {
            $links[] = [
                'nome' => 'WhatsApp Suporte',
                'url' => 'https://wa.me/5500000000000?text=Ol%C3%A1%2C%20preciso%20de%20suporte.',
                'ordem' => 1
            ];
        }
        JsonResponse::ok(['links' => $links]);
    }

    // GAME
    if ($method === 'GET' && $path === '/game/configs') {
        $authUser = null;
        $bearer = Request::bearerToken();
        if ($bearer) {
            $payload = Auth::decodeToken($bearer, (string)$config['app']['secret']);
            if (is_array($payload) && !empty($payload['uid'])) {
                $authUser = $userService->byId((int)$payload['uid']);
            }
        }
        JsonResponse::ok($gameService->getConfigs($authUser));
    }

    if ($method === 'POST' && $path === '/game/iniciar') {
        $u = $getAuthUser();
        $valorEntrada = (float)($body['valor_entrada'] ?? 0);
        $mult = isset($body['multiplicador_meta']) ? (float)$body['multiplicador_meta'] : null;
        JsonResponse::ok($gameService->iniciar($u, $valorEntrada, $mult));
    }

    if ($method === 'POST' && $path === '/game/finalizar') {
        $u = $getAuthUser();
        $partidaId = (string)($body['partida_id'] ?? '');
        $pp = (int)($body['plataformas_passadas'] ?? 0);
        $resgatou = (bool)($body['resgatou'] ?? false);
        JsonResponse::ok($gameService->finalizar($u, $partidaId, $pp, $resgatou));
    }

    // FINANCEIRO
    if ($method === 'POST' && $path === '/financeiro/deposito') {
        $u = $getAuthUser();
        JsonResponse::ok($finService->criarDeposito($u, $body));
    }

    if ($method === 'GET' && preg_match('#^/financeiro/deposito/status/(.+)$#', $path, $m)) {
        $u = $getAuthUser();
        JsonResponse::ok($finService->depositoStatus($u, urldecode($m[1])));
    }

    if ($method === 'POST' && $path === '/financeiro/saque') {
        $u = $getAuthUser();
        $valor = (float)($body['valor'] ?? 0);
        $pix = trim((string)($body['chave_pix'] ?? ''));
        $cpf = preg_replace('/\D+/', '', (string)($body['cpf'] ?? ''));
        if ($pix === '') JsonResponse::error('Informe a chave PIX.', 422);
        if (strlen($cpf) !== 11) JsonResponse::error('CPF inválido.', 422);
        JsonResponse::ok($finService->solicitarSaque($u, $valor, $pix, $cpf));
    }

    if ($method === 'POST' && $path === '/financeiro/saque-afiliado') {
        $u = $getAuthUser();
        $valor = (float)($body['valor'] ?? 0);
        $pix = trim((string)($body['chave_pix'] ?? ''));
        if ($pix === '') JsonResponse::error('Informe a chave PIX para saque da comissao.', 422);
        JsonResponse::ok($finService->solicitarSaqueAfiliado($u, $valor, $pix));
    }

    if ($method === 'GET' && $path === '/financeiro/historico') {
        $u = $getAuthUser();
        $pagina = (int)Request::query('pagina', 1);
        $limite = (int)Request::query('limite', 20);
        JsonResponse::ok($finService->historico($u, $pagina, $limite));
    }

    if ($method === 'GET' && $path === '/financeiro/meus-saques') {
        $u = $getAuthUser();
        JsonResponse::ok($finService->meusSaques($u));
    }

    // INDICAÇÃO
    if ($method === 'GET' && $path === '/indicacao/info') {
        $u = $getAuthUser();
        JsonResponse::ok($indicacaoService->info($u));
    }

    // CUPONS
    if ($method === 'POST' && $path === '/cupons/validar') {
        $u = $getAuthUser();
        $codigo = (string)($body['codigo'] ?? '');
        JsonResponse::ok($couponService->validar($u, $codigo));
    }

    if ($method === 'POST' && $path === '/cupons/resgatar') {
        $u = $getAuthUser();
        $codigo = (string)($body['codigo'] ?? '');
        JsonResponse::ok($couponService->resgatar($u, $codigo));
    }

    // ADMIN
    if ($method === 'POST' && $path === '/admin/login') {
        $telefone = $normalizeTel((string)($body['telefone'] ?? ''));
        $senha = (string)($body['senha'] ?? '');
        $u = $userService->byTelefone($telefone);
        if (!$u || (int)$u['is_admin'] !== 1 || !password_verify($senha, (string)$u['senha_hash'])) {
            JsonResponse::error('Credenciais inválidas.', 401);
        }
        $token = Auth::createToken(['uid' => (int)$u['id'], 'is_admin' => 1], (string)$config['app']['secret']);
        JsonResponse::ok(['token' => $token, 'user' => $userService->publicUser($u)]);
    }

    if ($method === 'GET' && $path === '/admin/me') {
        $u = $getAdminUser();
        JsonResponse::ok(['user' => $userService->publicUser($u)]);
    }

    if ($method === 'POST' && $path === '/admin/upload-image') {
        $getAdminUser();

        if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
            JsonResponse::error('Arquivo de imagem obrigatorio.', 422);
        }

        $file = $_FILES['image'];
        $errorCode = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($errorCode !== UPLOAD_ERR_OK) {
            JsonResponse::error('Falha no upload da imagem.', 422, ['upload_error' => $errorCode]);
        }

        $size = (int)($file['size'] ?? 0);
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($size <= 0 || $size > $maxSize) {
            JsonResponse::error('Imagem invalida. Tamanho maximo: 5MB.', 422);
        }

        $kindRaw = strtolower(trim((string)($_POST['kind'] ?? 'image')));
        $kind = in_array($kindRaw, ['logo', 'banner', 'favicon'], true) ? $kindRaw : 'image';

        $tmpName = (string)($file['tmp_name'] ?? '');
        if ($tmpName === '' || !is_uploaded_file($tmpName)) {
            JsonResponse::error('Upload invalido.', 422);
        }

        $mime = '';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo !== false) {
                $mime = (string)(finfo_file($finfo, $tmpName) ?: '');
                finfo_close($finfo);
            }
        }

        $extByMime = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/x-icon' => 'ico',
            'image/vnd.microsoft.icon' => 'ico',
        ];

        $originalName = (string)($file['name'] ?? '');
        $originalExt = strtolower((string)pathinfo($originalName, PATHINFO_EXTENSION));
        $ext = $extByMime[$mime] ?? '';
        if ($ext === '') {
            if (in_array($originalExt, ['jpg', 'jpeg', 'png', 'webp', 'ico'], true)) {
                $ext = $originalExt === 'jpeg' ? 'jpg' : $originalExt;
            } else {
                JsonResponse::error('Formato invalido. Use .jpg, .png, .webp ou .ico.', 422);
            }
        }

        $rootPath = dirname(__DIR__);
        $uploadDir = $rootPath . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'admin';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            JsonResponse::error('Nao foi possivel preparar a pasta de upload.', 500);
        }

        $filename = $kind . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $destPath = $uploadDir . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file($tmpName, $destPath)) {
            JsonResponse::error('Nao foi possivel salvar a imagem no servidor.', 500);
        }

        $relativeUrl = '/uploads/admin/' . $filename;
        $baseUrl = rtrim((string)($config['app']['url'] ?? ''), '/');
        $publicUrl = $baseUrl !== '' ? ($baseUrl . $relativeUrl) : $relativeUrl;

        JsonResponse::ok([
            'ok' => true,
            'kind' => $kind,
            'url' => $publicUrl,
            'relative_url' => $relativeUrl,
            'mime' => $mime,
            'size' => $size,
        ]);
    }

    if ($method === 'GET' && $path === '/admin/config') {
        $getAdminUser();
        JsonResponse::ok([
            'public' => $cfgService->get('public', []),
            'game' => $cfgService->get('game', []),
            'gateway' => $cfgService->get('gateway', []),
            'indicacao' => $cfgService->get('indicacao', []),
            'bonus_primeiro_deposito' => $cfgService->get('bonus_primeiro_deposito', []),
            'deposito_bonus' => $cfgService->get('deposito_bonus', []),
        ]);
    }

    if ($method === 'PUT' && $path === '/admin/config') {
        $getAdminUser();
        foreach (['public', 'game', 'gateway', 'indicacao', 'bonus_primeiro_deposito', 'deposito_bonus'] as $key) {
            if (isset($body[$key]) && is_array($body[$key])) {
                if ($key === 'game') {
                    if (isset($body[$key]['influencer_easy_users']) && is_array($body[$key]['influencer_easy_users'])) {
                        $body[$key]['influencer_easy_users'] = array_values(array_unique(array_map(
                            static fn($v) => (int)$v,
                            array_filter($body[$key]['influencer_easy_users'], static fn($v) => (int)$v > 0)
                        )));
                    }
                    if (isset($body[$key]['influencer_meta_multiplicador'])) {
                        $imm = (float)$body[$key]['influencer_meta_multiplicador'];
                        $body[$key]['influencer_meta_multiplicador'] = $imm > 0 ? $imm : 3.0;
                    }
                    if (isset($body[$key]['multiplicador_inicial'])) {
                        $mi = (float)$body[$key]['multiplicador_inicial'];
                        $body[$key]['multiplicador_inicial'] = $mi > 0 ? $mi : 1.0;
                    }
                    if (isset($body[$key]['multiplicador_incremento'])) {
                        $mc = (float)$body[$key]['multiplicador_incremento'];
                        $body[$key]['multiplicador_incremento'] = $mc > 0 ? $mc : 0.2;
                    }
                    if (isset($body[$key]['multiplicador_max'])) {
                        $mx = (float)$body[$key]['multiplicador_max'];
                        $body[$key]['multiplicador_max'] = $mx > 0 ? $mx : 0.0;
                    }
                    if (isset($body[$key]['min_acertos_saque'])) {
                        $ma = (int)$body[$key]['min_acertos_saque'];
                        $body[$key]['min_acertos_saque'] = $ma > 0 ? $ma : 5;
                    }
                } elseif ($key === 'bonus_primeiro_deposito') {
                    if (isset($body[$key]['percentual_bonus'])) {
                        $perc = (float)$body[$key]['percentual_bonus'];
                        $body[$key]['percentual_bonus'] = $perc >= 0 ? $perc : 0.0;
                    }
                    if (isset($body[$key]['rollover_multiplicador'])) {
                        $roll = (float)$body[$key]['rollover_multiplicador'];
                        $body[$key]['rollover_multiplicador'] = $roll > 0 ? $roll : 3.0;
                    }
                    if (isset($body[$key]['modo_aplicacao'])) {
                        $modo = strtolower(trim((string)$body[$key]['modo_aplicacao']));
                        $body[$key]['modo_aplicacao'] = in_array($modo, ['sempre', 'always'], true) ? 'sempre' : 'primeiro_deposito';
                    }
                }
                $base = $cfgService->get($key, []);
                $cfgService->set($key, $deepMerge($base, $body[$key]));
            }
        }
        JsonResponse::ok(['ok' => true]);
    }

    if ($method === 'GET' && $path === '/admin/bonus-primeiro-deposito') {
        $getAdminUser();
        $pagina = (int)Request::query('pagina', 1);
        $limite = (int)Request::query('limite', 200);
        JsonResponse::ok($finService->adminListPrimeiroDepositoBonus($pagina, $limite));
    }

    if ($method === 'GET' && $path === '/admin/users') {
        $getAdminUser();
        $users = array_map(fn($u) => $userService->publicUser($u), $userService->listUsers(1000));
        JsonResponse::ok(['users' => $users]);
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/users/(\d+)$#', $path, $m)) {
        $getAdminUser();
        $id = (int)$m[1];
        $patch = [];
        foreach (['nome','apelido_admin','email','telefone','is_admin','is_influencer','comissao_indicacao_perc','saldo','saldo_afiliado','chave_pix'] as $f) {
            if (array_key_exists($f, $body)) {
                $patch[$f] = $body[$f];
            }
        }
        if (array_key_exists('comissao_indicacao_perc', $patch)) {
            $raw = $patch['comissao_indicacao_perc'];
            if ($raw === '' || $raw === null) {
                $patch['comissao_indicacao_perc'] = null;
            } else {
                $v = (float)$raw;
                if ($v < 0 || $v > 100) {
                    JsonResponse::error('Comissao personalizada deve ficar entre 0 e 100.', 422);
                }
                $patch['comissao_indicacao_perc'] = $v;
            }
        }
        $userService->updateFields($id, $patch);
        $u = $userService->byId($id);
        JsonResponse::ok(['user' => $u ? $userService->publicUser($u) : null]);
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/users/(\d+)/comissao$#', $path, $m)) {
        $getAdminUser();
        $id = (int)$m[1];
        $raw = $body['comissao_indicacao_perc'] ?? null;
        if ($raw === '' || $raw === null) {
            $value = null;
        } else {
            $value = (float)$raw;
            if ($value < 0 || $value > 100) {
                JsonResponse::error('Comissao personalizada deve ficar entre 0 e 100.', 422);
            }
        }
        $userService->updateFields($id, ['comissao_indicacao_perc' => $value]);
        $u = $userService->byId($id);
        JsonResponse::ok(['user' => $u ? $userService->publicUser($u) : null]);
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/users/(\d+)/influencer$#', $path, $m)) {
        $getAdminUser();
        $id = (int)$m[1];
        $flag = (int)($body['is_influencer'] ?? 0) ? 1 : 0;
        $userService->updateFields($id, ['is_influencer' => $flag]);
        $game = $cfgService->get('game', []);
        $hasEasyList = array_key_exists('influencer_easy_users', $game);
        $easyUsers = array_values(array_unique(array_map(
            static fn($v) => (int)$v,
            array_filter((array)($game['influencer_easy_users'] ?? []), static fn($v) => (int)$v > 0)
        )));
        if ($hasEasyList && $flag === 0 && in_array($id, $easyUsers, true)) {
            $easyUsers = array_values(array_filter($easyUsers, static fn($v) => (int)$v !== $id));
            $game['influencer_easy_users'] = $easyUsers;
            $cfgService->set('game', $game);
        }
        $u = $userService->byId($id);
        JsonResponse::ok(['user' => $u ? $userService->publicUser($u) : null]);
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/users/(\d+)/influencer-easy$#', $path, $m)) {
        $getAdminUser();
        $id = (int)$m[1];
        $enable = (int)($body['enabled'] ?? 0) ? 1 : 0;

        $game = $cfgService->get('game', []);
        $hasEasyList = array_key_exists('influencer_easy_users', $game);
        $easyUsers = array_values(array_unique(array_map(
            static fn($v) => (int)$v,
            array_filter((array)($game['influencer_easy_users'] ?? []), static fn($v) => (int)$v > 0)
        )));

        if ($enable === 1) {
            if (!$hasEasyList) {
                JsonResponse::ok(['user_id' => $id, 'influencer_easy' => true, 'influencer_easy_users' => []]);
            }
            if (!in_array($id, $easyUsers, true)) {
                $easyUsers[] = $id;
            }
        } else {
            if (!$hasEasyList) {
                // convert "all easy" to explicit list without this user
                $rows = $userService->listUsers(1000);
                $easyUsers = array_values(array_map(
                    static fn($u) => (int)$u['id'],
                    array_filter($rows, static fn($u) => (int)($u['is_influencer'] ?? 0) === 1 && (int)($u['id'] ?? 0) !== $id)
                ));
            } else {
                $easyUsers = array_values(array_filter($easyUsers, static fn($v) => (int)$v !== $id));
            }
        }

        $game['influencer_easy_users'] = $easyUsers;
        $cfgService->set('game', $game);
        JsonResponse::ok(['user_id' => $id, 'influencer_easy' => $enable === 1, 'influencer_easy_users' => $easyUsers]);
    }

    if ($method === 'POST' && preg_match('#^/admin/users/(\d+)/credit$#', $path, $m)) {
        $admin = $getAdminUser();
        $id = (int)$m[1];
        $valor = (float)($body['valor'] ?? 0);
        $alvo = (string)($body['alvo'] ?? 'saldo');
        $motivo = trim((string)($body['motivo'] ?? ''));
        JsonResponse::ok($finService->adminCreditarSaldo($id, $valor, $alvo, $motivo, $admin));
    }

    if ($method === 'POST' && preg_match('#^/admin/users/(\d+)/limpar-comissao$#', $path, $m)) {
        $admin = $getAdminUser();
        $id = (int)$m[1];
        $motivo = trim((string)($body['motivo'] ?? ''));
        JsonResponse::ok($finService->adminLimparSaldoComissao($id, $admin, $motivo));
    }

    if ($method === 'GET' && $path === '/admin/saques') {
        $getAdminUser();
        $status = (string)Request::query('status', 'pendente');
        $pagina = (int)Request::query('pagina', 1);
        $limite = (int)Request::query('limite', 100);
        $tipo = (string)Request::query('tipo', '');
        JsonResponse::ok($finService->adminListSaques($status, $pagina, $limite, $tipo));
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/saques/(\d+)/aprovar$#', $path, $m)) {
        $admin = $getAdminUser();
        $id = (int)$m[1];
        $motivo = trim((string)($body['motivo'] ?? ''));
        JsonResponse::ok($finService->adminProcessarSaque($id, 'aprovar', $admin, $motivo));
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/saques/(\d+)/recusar$#', $path, $m)) {
        $admin = $getAdminUser();
        $id = (int)$m[1];
        $motivo = trim((string)($body['motivo'] ?? ''));
        JsonResponse::ok($finService->adminProcessarSaque($id, 'recusar', $admin, $motivo));
    }

    if ($method === 'GET' && $path === '/admin/suporte-links') {
        $getAdminUser();
        $rows = $pdo->query('SELECT id,nome,url,ordem,ativo FROM suporte_links ORDER BY ordem ASC, id ASC')->fetchAll() ?: [];
        JsonResponse::ok(['links' => $rows]);
    }

    if ($method === 'POST' && $path === '/admin/suporte-links') {
        $getAdminUser();
        $nome = trim((string)($body['nome'] ?? ''));
        $url = trim((string)($body['url'] ?? ''));
        $ordem = (int)($body['ordem'] ?? 0);
        if ($nome === '' || $url === '') JsonResponse::error('Nome/URL obrigatórios.', 422);
        $stmt = $pdo->prepare('INSERT INTO suporte_links (nome,url,ordem,ativo) VALUES (:n,:u,:o,1)');
        $stmt->execute([':n' => $nome, ':u' => $url, ':o' => $ordem]);
        JsonResponse::ok(['id' => (int)$pdo->lastInsertId()]);
    }

    if (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/admin/suporte-links/(\d+)$#', $path, $m)) {
        $getAdminUser();
        $id = (int)$m[1];
        $stmt = $pdo->prepare('UPDATE suporte_links SET nome=:n,url=:u,ordem=:o,ativo=:a WHERE id=:id');
        $stmt->execute([
            ':n' => trim((string)($body['nome'] ?? 'Suporte')),
            ':u' => trim((string)($body['url'] ?? '#')),
            ':o' => (int)($body['ordem'] ?? 0),
            ':a' => (int)($body['ativo'] ?? 1) ? 1 : 0,
            ':id' => $id,
        ]);
        JsonResponse::ok(['ok' => true]);
    }

    if ($method === 'POST' && in_array($path, ['/webhooks/deposito', '/webhook/ecompag', '/webhooks/ecompag', '/webhook/sigilopay', '/webhooks/sigilopay', '/webhook/amplopay', '/webhooks/amplopay'], true)) {
        // endpoint generico para webhook de gateways
        JsonResponse::ok($finService->processarWebhookDeposito($body, $_GET));
    }

    JsonResponse::error('Endpoint não encontrado.', 404);
} catch (RuntimeException $e) {
    JsonResponse::error($e->getMessage(), 400);
} catch (Throwable $e) {
    if (($config['app']['debug'] ?? false) === true) {
        JsonResponse::error($e->getMessage(), 500, ['trace' => explode("\n", $e->getTraceAsString())]);
    }
    JsonResponse::error('Erro interno.', 500);
}

