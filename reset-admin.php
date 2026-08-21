<?php
/**
 * RESET DE ADMIN - USO UNICO
 * ---------------------------------------------------------------
 * 1) Suba este arquivo na raiz do site (public_html).
 * 2) Acesse: https://SEUDOMINIO/reset-admin.php?key=JUMPP-RESET-2026
 * 3) Depois de ver "OK", clique em apagar (ou delete o arquivo).
 *
 * Ele cria (ou atualiza) o usuario admin com:
 *   Telefone: 11970002026
 *   Senha:    Wanrelci123
 */

declare(strict_types=1);

const RESET_KEY = 'JUMPP-RESET-2026';
const ADMIN_TEL = '11970002026';
const ADMIN_SENHA = 'Wanrelci123';
const ADMIN_NOME = 'Administrador';

header('Content-Type: text/html; charset=utf-8');

if (($_GET['key'] ?? '') !== RESET_KEY) {
    http_response_code(403);
    exit('Acesso negado.');
}

/* ---------- descobre credenciais do banco (mesma logica do app) ---------- */
function envFromFile(string $file): array
{
    $out = [];
    if (!is_file($file)) {
        return $out;
    }
    foreach (file($file, FILE_IGNORE_NEW_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v);
        // o app so aceita chaves simples; ignora qualquer outra coisa (ex: dump SQL)
        if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $k)) {
            continue;
        }
        $out[$k] = trim($v, "\"'");
    }
    return $out;
}

$env = envFromFile(__DIR__ . '/.env');

$driver = $env['DB_DRIVER'] ?? 'sqlite';
$sqlitePath = __DIR__ . '/' . ($env['DB_PATH'] ?? 'api/storage/database.sqlite');

try {
    if ($driver === 'sqlite') {
        $pdo = new PDO('sqlite:' . $sqlitePath);
        $pdo->exec('PRAGMA foreign_keys = ON');
    } else {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $env['DB_HOST'] ?? '127.0.0.1',
            (int)($env['DB_PORT'] ?? 3306),
            $env['DB_NAME'] ?? '',
            $env['DB_CHARSET'] ?? 'utf8mb4'
        );
        $pdo = new PDO($dsn, $env['DB_USER'] ?? '', $env['DB_PASS'] ?? '');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    http_response_code(500);
    exit('Erro ao conectar no banco: ' . htmlspecialchars($e->getMessage()));
}

/* ---------- descobre as colunas existentes da tabela users ---------- */
function tableColumns(PDO $pdo, string $driver, string $table): array
{
    try {
        if ($driver === 'sqlite') {
            $rows = $pdo->query('PRAGMA table_info(' . $table . ')')->fetchAll();
            return array_map(static fn ($r) => (string)$r['name'], $rows);
        }
        $rows = $pdo->query('SHOW COLUMNS FROM `' . $table . '`')->fetchAll();
        return array_map(static fn ($r) => (string)$r['Field'], $rows);
    } catch (Throwable $e) {
        return [];
    }
}

$cols = tableColumns($pdo, $driver, 'users');
if (!$cols) {
    http_response_code(500);
    exit('Tabela "users" nao encontrada. Abra o site uma vez para o banco ser criado e tente de novo.');
}

$now = date('Y-m-d H:i:s');
$hash = password_hash(ADMIN_SENHA, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE telefone = :t LIMIT 1');
    $stmt->execute([':t' => ADMIN_TEL]);
    $existing = $stmt->fetch();

    if ($existing) {
        $sets = ['senha_hash = :h', 'is_admin = 1'];
        $params = [':h' => $hash, ':id' => (int)$existing['id']];
        if (in_array('updated_at', $cols, true)) {
            $sets[] = 'updated_at = :u';
            $params[':u'] = $now;
        }
        $pdo->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = :id')->execute($params);
        $acao = 'Senha do admin redefinida (usuario ja existia).';
    } else {
        $data = [
            'nome' => ADMIN_NOME,
            'email' => 'admin' . ADMIN_TEL . '@jumppx.com',
            'telefone' => ADMIN_TEL,
            'senha_hash' => $hash,
            'codigo_indicacao' => 'ADM' . substr((string)time(), -6),
            'is_admin' => 1,
            'is_influencer' => 0,
            'saldo' => 0,
            'saldo_afiliado' => 0,
            'total_partidas' => 0,
            'saque_liberado_bonus' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ];
        // usa apenas colunas que existem de fato na tabela
        $data = array_intersect_key($data, array_flip($cols));

        $fields = array_keys($data);
        $sql = 'INSERT INTO users (' . implode(',', $fields) . ') VALUES (:' . implode(',:', $fields) . ')';
        $ins = $pdo->prepare($sql);
        foreach ($data as $k => $v) {
            $ins->bindValue(':' . $k, $v);
        }
        $ins->execute();
        $acao = 'Novo usuario admin criado.';
    }

    /* ---------- confere se o login vai funcionar de verdade ---------- */
    $check = $pdo->prepare('SELECT senha_hash, is_admin FROM users WHERE telefone = :t LIMIT 1');
    $check->execute([':t' => ADMIN_TEL]);
    $row = $check->fetch();
    $ok = $row && (int)$row['is_admin'] === 1 && password_verify(ADMIN_SENHA, (string)$row['senha_hash']);
} catch (Throwable $e) {
    http_response_code(500);
    exit('Erro ao gravar no banco: ' . htmlspecialchars($e->getMessage()));
}

if (isset($_GET['apagar'])) {
    @unlink(__FILE__);
    exit('Arquivo reset-admin.php apagado. Pronto!');
}
?>
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Reset de admin</title>
<style>body{font-family:system-ui,sans-serif;background:#0f1115;color:#e8e8ea;padding:40px}
.card{max-width:520px;margin:auto;background:#171a21;border:1px solid #262a34;border-radius:14px;padding:24px}
b{color:#7ee787}a{color:#7ee787}.err{color:#ff7b72}</style></head>
<body><div class="card">
<h2><?= $ok ? 'OK' : 'ATENCAO' ?> - <?= htmlspecialchars($acao) ?></h2>
<?php if ($ok): ?>
<p>Teste de login conferido com sucesso. Entre em <a href="/admin/">/admin/</a> com:</p>
<p>Telefone: <b><?= htmlspecialchars(ADMIN_TEL) ?></b><br>
Senha: <b><?= htmlspecialchars(ADMIN_SENHA) ?></b></p>
<p><a href="?key=<?= urlencode(RESET_KEY) ?>&amp;apagar=1">Clique aqui para apagar este arquivo</a> (recomendado).</p>
<?php else: ?>
<p class="err">Gravou, mas a verificacao de login falhou. Recarregue esta pagina.</p>
<?php endif; ?>
<p style="opacity:.6">Banco: <?= htmlspecialchars($driver) ?></p>
</div></body></html>
