<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Util;
use PDO;
use Throwable;

/**
 * Eventos sociais reais (cadastro, deposito aprovado, saque aprovado).
 * Alimenta as notificacoes que aparecem na tela e, opcionalmente,
 * dispara um webhook para o gateway/CRM quando alguem se cadastra.
 */
final class EventoService
{
    public function __construct(private readonly PDO $pdo, private readonly array $config = [])
    {
        $this->ensureTable();
    }

    private function ensureTable(): void
    {
        try {
            $driver = (string)$this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'mysql') {
                $this->pdo->exec(
                    'CREATE TABLE IF NOT EXISTS eventos_sociais (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        tipo VARCHAR(32) NOT NULL,
                        nome VARCHAR(120) NOT NULL,
                        valor DECIMAL(12,2) NOT NULL DEFAULT 0,
                        created_at DATETIME NOT NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
                );
                return;
            }
            $this->pdo->exec(
                'CREATE TABLE IF NOT EXISTS eventos_sociais (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tipo TEXT NOT NULL,
                    nome TEXT NOT NULL,
                    valor REAL NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL
                )'
            );
        } catch (Throwable) {
            // nao pode quebrar a aplicacao
        }
    }

    /** Converte "Joao Silva" / telefone em "Joao S." para exibir sem expor dados. */
    public static function apelido(string $nome, string $telefone = ''): string
    {
        $nome = trim(preg_replace('/\s+/', ' ', $nome) ?? '');
        if ($nome !== '') {
            $partes = explode(' ', $nome);
            $primeiro = ucfirst(mb_strtolower($partes[0]));
            $inicial = isset($partes[1]) ? mb_strtoupper(mb_substr($partes[1], 0, 1)) . '.' : '';
            return trim($primeiro . ' ' . $inicial);
        }
        $d = preg_replace('/\D+/', '', $telefone) ?? '';
        if (strlen($d) >= 4) {
            return 'Jogador ' . substr($d, 0, 2) . '***' . substr($d, -2);
        }
        return 'Novo jogador';
    }

    public function registrar(string $tipo, string $nome, float $valor = 0.0): void
    {
        try {
            $stmt = $this->pdo->prepare(
                'INSERT INTO eventos_sociais (tipo, nome, valor, created_at) VALUES (:t,:n,:v,:c)'
            );
            $stmt->execute([
                ':t' => $tipo,
                ':n' => $nome,
                ':v' => $valor,
                ':c' => Util::now(),
            ]);
        } catch (Throwable) {
            // evento nunca pode derrubar o fluxo principal
        }
    }

    /** Chamado quando um usuario finaliza o cadastro. */
    public function cadastroRealizado(array $user): void
    {
        $apelido = self::apelido((string)($user['nome'] ?? ''), (string)($user['telefone'] ?? ''));
        $this->registrar('cadastro', $apelido, 0.0);
        $this->notificarGateway([
            'event' => 'user.registered',
            'user_id' => (int)($user['id'] ?? 0),
            'name' => (string)($user['nome'] ?? ''),
            'phone' => (string)($user['telefone'] ?? ''),
            'email' => (string)($user['email'] ?? ''),
            'referral_code' => (string)($user['codigo_indicacao'] ?? ''),
            'created_at' => (string)($user['created_at'] ?? Util::now()),
        ]);
    }

    /**
     * Envia a notificacao de cadastro para o gateway / CRM.
     * Configure LEAD_WEBHOOK_URL (e opcionalmente LEAD_WEBHOOK_TOKEN) no .env.
     * Sem URL configurada, nada e enviado.
     */
    private function notificarGateway(array $payload): void
    {
        $url = trim((string)($this->config['notificacoes']['lead_webhook_url'] ?? ''));
        if ($url === '' || !function_exists('curl_init')) {
            return;
        }
        $token = trim((string)($this->config['notificacoes']['lead_webhook_token'] ?? ''));

        try {
            $headers = ['Content-Type: application/json', 'Accept: application/json'];
            if ($token !== '') {
                $headers[] = 'Authorization: Bearer ' . $token;
            }
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_TIMEOUT => 6,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                CURLOPT_USERAGENT => 'JumpPX-Server/1.0 (+https://jumppx.com)',
            ]);
            curl_exec($ch);
            curl_close($ch);
        } catch (Throwable) {
            // webhook e best-effort
        }
    }

    /** Ultimos eventos reais para o feed da tela. */
    public function recentes(int $limit = 12, int $afterId = 0): array
    {
        try {
            $limit = max(1, min(30, $limit));
            $sql = 'SELECT id, tipo, nome, valor, created_at FROM eventos_sociais';
            if ($afterId > 0) {
                $sql .= ' WHERE id > :a';
            }
            $sql .= ' ORDER BY id DESC LIMIT ' . $limit;
            $stmt = $this->pdo->prepare($sql);
            if ($afterId > 0) {
                $stmt->bindValue(':a', $afterId, PDO::PARAM_INT);
            }
            $stmt->execute();
            $rows = $stmt->fetchAll() ?: [];
            return array_reverse(array_map(static fn(array $r): array => [
                'id' => (int)$r['id'],
                'tipo' => (string)$r['tipo'],
                'nome' => (string)$r['nome'],
                'valor' => (float)$r['valor'],
                'created_at' => (string)$r['created_at'],
            ], $rows));
        } catch (Throwable) {
            return [];
        }
    }
}
