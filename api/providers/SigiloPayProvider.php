<?php

declare(strict_types=1);

namespace App\Providers;

use RuntimeException;

final class SigiloPayProvider implements PaymentProviderInterface
{
    public function __construct(private readonly array $cfg)
    {
    }

    private function baseUrl(): string
    {
        $base = (string)($this->cfg['base_url'] ?? '');
        if ($base === '') {
            $base = 'https://app.sigilopay.com.br/api/v1';
        }
        return rtrim($base, '/');
    }

    private function credentials(): array
    {
        $public = (string)($this->cfg['public_key'] ?? '');
        $secret = (string)($this->cfg['secret_key'] ?? '');
        if ($public === '' || $secret === '') {
            throw new RuntimeException('Configure SIGILOPAY_PUBLIC_KEY e SIGILOPAY_SECRET_KEY.');
        }
        return [$public, $secret];
    }

    private function detectBlockedByFirewall(string $rawBody): void
    {
        $trim = ltrim($rawBody);
        if (str_starts_with(strtolower($trim), '<!doctype html') || str_starts_with(strtolower($trim), '<html')) {
            throw new RuntimeException(
                'SigiloPay bloqueou a origem da requisicao (retornou HTML). Rode o servidor em BR/EUA/PT.'
            );
        }
    }

    private function request(string $method, string $path, ?array $body = null): array
    {
        [$public, $secret] = $this->credentials();
        $url = $this->baseUrl() . '/' . ltrim($path, '/');

        $ch = curl_init($url);
        $headers = [
            'Content-Type: application/json',
            'x-public-key: ' . $public,
            'x-secret-key: ' . $secret,
        ];

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE));
        }

        $resp = curl_exec($ch);
        $err = curl_error($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false) {
            throw new RuntimeException('Falha HTTP SigiloPay: ' . $err);
        }

        $this->detectBlockedByFirewall((string)$resp);

        $json = json_decode((string)$resp, true);
        if (!is_array($json)) {
            $json = null;
        }

        return [
            'status' => $code,
            'body' => $json,
            'raw' => (string)$resp,
            'url' => $url,
        ];
    }

    private function buildErrorMessage(array $response): string
    {
        $body = $response['body'] ?? null;
        if (is_array($body)) {
            $message = (string)($body['message'] ?? $body['error'] ?? $body['errorCode'] ?? '');
            if ($message !== '') {
                return $message;
            }
            return json_encode($body, JSON_UNESCAPED_UNICODE) ?: 'Erro desconhecido';
        }

        $raw = trim((string)($response['raw'] ?? ''));
        if ($raw !== '') {
            return substr($raw, 0, 220);
        }

        return 'Resposta vazia da SigiloPay';
    }

    private function isNotFoundResponse(array $response): bool
    {
        if ((int)($response['status'] ?? 0) === 404) {
            return true;
        }

        $body = $response['body'] ?? null;
        if (is_array($body)) {
            $probe = strtoupper((string)($body['errorCode'] ?? $body['message'] ?? $body['error'] ?? ''));
            if (str_contains($probe, 'NOT_FOUND') || str_contains($probe, 'ROUTE_NOT_FOUND')) {
                return true;
            }
        }

        $raw = strtoupper(trim((string)($response['raw'] ?? '')));
        return str_contains($raw, 'NOT_FOUND');
    }

    private function requestWithPathFallback(string $method, array $paths, ?array $body = null): array
    {
        $uniquePaths = [];
        foreach ($paths as $path) {
            $p = trim((string)$path);
            if ($p === '' || in_array($p, $uniquePaths, true)) {
                continue;
            }
            $uniquePaths[] = $p;
        }

        $last = null;
        foreach ($uniquePaths as $path) {
            $resp = $this->request($method, $path, $body);
            $last = $resp;

            if ((int)$resp['status'] >= 200 && (int)$resp['status'] < 300 && is_array($resp['body'])) {
                $resp['resolved_path'] = $path;
                return $resp;
            }

            if (!$this->isNotFoundResponse($resp)) {
                $msg = $this->buildErrorMessage($resp);
                throw new RuntimeException('Erro SigiloPay: ' . $msg);
            }
        }

        if (is_array($last)) {
            $msg = $this->buildErrorMessage($last);
            throw new RuntimeException(
                'Resposta invalida da SigiloPay: ' . $msg
                . '. Ajuste SIGILOPAY_CREATE_PIX_PATH=/gateway/pix/receive e SIGILOPAY_STATUS_PATH=/gateway/transactions?id={id}.'
            );
        }

        throw new RuntimeException('Nao foi possivel conectar na SigiloPay.');
    }

    private function normalizePhone(string $rawPhone): string
    {
        $digits = preg_replace('/\D+/', '', $rawPhone);
        if (strlen($digits) === 11) {
            return sprintf('(%s) %s-%s', substr($digits, 0, 2), substr($digits, 2, 5), substr($digits, 7, 4));
        }
        if (strlen($digits) === 10) {
            return sprintf('(%s) %s-%s', substr($digits, 0, 2), substr($digits, 2, 4), substr($digits, 6, 4));
        }
        return trim($rawPhone);
    }

    private function statusToInternal(string $statusRaw): string
    {
        $s = strtoupper($statusRaw);
        if (in_array($s, ['COMPLETED', 'PAID', 'APPROVED'], true)) {
            return 'aprovado';
        }
        if (in_array($s, ['FAILED', 'REFUNDED', 'CHARGED_BACK', 'CANCELED', 'CANCELLED', 'REJECTED'], true)) {
            return 'cancelado';
        }
        return 'pendente';
    }

    private function normalizeQrImage(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }
        if (str_starts_with($value, 'data:image') || str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }
        return 'data:image/png;base64,' . $value;
    }

    public function createDeposit(array $payload): array
    {
        $amount = round((float)($payload['valor'] ?? 0), 2);
        if ($amount <= 0) {
            throw new RuntimeException('Valor de deposito invalido.');
        }

        $document = preg_replace('/\D+/', '', (string)($payload['cpf'] ?? ''));
        if ($document === '') {
            $document = preg_replace('/\D+/', '', (string)($payload['documento'] ?? ''));
        }
        if (strlen($document) < 11) {
            throw new RuntimeException('CPF/documento invalido para criar deposito na SigiloPay.');
        }

        $nome = trim((string)($payload['nome'] ?? ''));
        if ($nome === '') { $nome = 'Cliente Jumpcash'; }
        if (!preg_match('/\s+\S+/', $nome)) { $nome .= ' Silva'; }
        $nome = preg_replace('/[^A-Za-zÀ-ÿ\s\.\-]/u', '', $nome);
        $nome = preg_replace('/\s+/', ' ', trim($nome));
        if (mb_strlen($nome) < 4) { $nome = 'Cliente Jumpcash'; }
        $email = trim((string)($payload['email'] ?? 'cliente@jogosmania.site'));
        $telefone = $this->normalizePhone((string)($payload['telefone'] ?? ''));
        $identifier = (string)($payload['external_reference'] ?? ('DEP-' . uniqid()));
        $callbackUrl = (string)($payload['webhook_url'] ?? '');

        $createPath = (string)($this->cfg['create_pix_path'] ?? '/gateway/pix/receive');

        $body = [
            'amount' => $amount,
            'identifier' => $identifier,
            'callbackUrl' => $callbackUrl,
            'client' => [
                'name' => $nome,
                'email' => $email,
                'phone' => $telefone,
                'document' => $document,
            ],
            'metadata' => [
                'source' => 'towerslot',
                'type' => 'deposito',
            ],
        ];

        $res = $this->requestWithPathFallback('POST', [$createPath, '/gateway/pix/receive', '/transactions/pix'], $body);
        $b = is_array($res['body']) ? $res['body'] : [];

        $tx = is_array($b['transaction'] ?? null) ? $b['transaction'] : $b;
        $pix = is_array($b['pix'] ?? null) ? $b['pix'] : [];
        $pixInfo = is_array($tx['pixInformation'] ?? null) ? $tx['pixInformation'] : $pix;

        $transactionId = (string)($tx['id'] ?? $b['transactionId'] ?? $b['id'] ?? '');
        if ($transactionId === '') {
            $transactionId = 'SIG-' . uniqid();
        }

        $status = $this->statusToInternal((string)($tx['status'] ?? $b['status'] ?? 'PENDING'));
        $qrTexto = (string)($pixInfo['code'] ?? $pixInfo['qrCode'] ?? $b['qrcode'] ?? $b['pixCopiaCola'] ?? '');
        $qrImagem = $this->normalizeQrImage((string)($pixInfo['base64'] ?? $pixInfo['image'] ?? $b['qrcode_image'] ?? ''));

        $meta = [
            'sigilopay' => $b,
            'identifier' => $identifier,
            'webhook_token' => (string)($b['webhookToken'] ?? $b['token'] ?? ''),
            'resolved_path' => (string)($res['resolved_path'] ?? $createPath),
        ];

        return [
            'txid' => $transactionId,
            'qrcode_texto' => $qrTexto,
            'qrcode_imagem' => $qrImagem,
            'expiracao_minutos' => (int)($b['expiresInMinutes'] ?? 30),
            'provider_ref' => $transactionId,
            'status' => $status,
            'meta' => $meta,
        ];
    }

    public function getDepositStatus(array $deposit): array
    {
        $ref = (string)($deposit['provider_ref'] ?: $deposit['txid']);
        if ($ref === '') {
            return ['status' => 'pendente'];
        }

        $statusPathCfg = (string)($this->cfg['status_path'] ?? '/gateway/transactions?id={id}');
        $statusPathCfg = str_replace('{id}', rawurlencode($ref), $statusPathCfg);

        $candidates = [
            $statusPathCfg,
            '/gateway/transactions?id=' . rawurlencode($ref),
            '/transactions/' . rawurlencode($ref),
        ];

        $res = null;
        foreach ($candidates as $path) {
            $tmp = $this->request('GET', $path, null);
            if ((int)$tmp['status'] >= 200 && (int)$tmp['status'] < 300 && is_array($tmp['body'])) {
                $res = $tmp;
                break;
            }
            if (!$this->isNotFoundResponse($tmp)) {
                return ['status' => 'pendente'];
            }
        }

        if (!is_array($res) || !is_array($res['body'] ?? null)) {
            return ['status' => 'pendente'];
        }

        $b = $res['body'];
        $tx = [];
        if (is_array($b['transaction'] ?? null)) {
            $tx = $b['transaction'];
        } elseif (is_array($b['transactions'] ?? null) && !empty($b['transactions']) && is_array($b['transactions'][0])) {
            $tx = $b['transactions'][0];
        } elseif (isset($b[0]) && is_array($b[0])) {
            $tx = $b[0];
        } else {
            $tx = $b;
        }

        $status = $this->statusToInternal((string)($tx['status'] ?? 'PENDING'));
        if ($status === 'aprovado') {
            return ['status' => 'aprovado', 'valor' => (float)($tx['amount'] ?? $deposit['valor'])];
        }
        if ($status === 'cancelado') {
            return ['status' => 'cancelado'];
        }

        return ['status' => 'pendente'];
    }
}
