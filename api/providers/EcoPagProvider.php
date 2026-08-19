<?php

declare(strict_types=1);

namespace App\Providers;

use RuntimeException;

final class EcoPagProvider implements PaymentProviderInterface
{
    public function __construct(private readonly array $cfg)
    {
    }

    private function baseUrl(): string
    {
        $base = (string)($this->cfg['base_url'] ?? '');
        if ($base === '') {
            $base = 'https://api.ecompag.com/v2';
        }
        return rtrim($base, '/');
    }

    private function requestForm(string $method, string $path, array $params = []): array
    {
        $url = $this->baseUrl() . '/' . ltrim($path, '/');
        $method = strtoupper($method);

        if ($method === 'GET' && !empty($params)) {
            $url .= (str_contains($url, '?') ? '&' : '?') . http_build_query($params);
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT => 25,
        ]);

        if ($method !== 'GET') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        }

        $resp = curl_exec($ch);
        $err = curl_error($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false) {
            throw new RuntimeException('Falha HTTP Ecompag: ' . $err);
        }

        $json = json_decode($resp, true);
        if (!is_array($json)) {
            $json = ['raw' => $resp];
        }

        return ['status' => $code, 'body' => $json];
    }

    private function requestBearerLegacy(string $method, string $path, array $body = []): array
    {
        $key = (string)($this->cfg['api_key'] ?? '');
        if ($key === '') {
            throw new RuntimeException('Configure ECOMPAG_CLIENT_ID + ECOMPAG_CLIENT_SECRET (v2) ou ECOMPAG_API_KEY (legado).');
        }

        $url = $this->baseUrl() . '/' . ltrim($path, '/');
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $key,
            ],
            CURLOPT_TIMEOUT => 25,
        ]);

        if (strtoupper($method) !== 'GET') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE));
        }

        $resp = curl_exec($ch);
        $err = curl_error($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false) {
            throw new RuntimeException('Falha HTTP Ecompag (legacy): ' . $err);
        }

        $json = json_decode($resp, true);
        if (!is_array($json)) {
            $json = ['raw' => $resp];
        }

        return ['status' => $code, 'body' => $json];
    }

    private function usingClientCredentials(): bool
    {
        return (string)($this->cfg['client_id'] ?? '') !== '' && (string)($this->cfg['client_secret'] ?? '') !== '';
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

        if ($this->usingClientCredentials()) {
            $cpf = preg_replace('/\D+/', '', (string)($payload['cpf'] ?? ''));
            if (strlen($cpf) !== 11) {
                throw new RuntimeException('CPF obrigatorio para gerar PIX na Ecompag.');
            }

            $nomeEco = trim((string)($payload['nome'] ?? ''));
            if ($nomeEco === '') { $nomeEco = 'Cliente Jumpcash'; }
            if (!preg_match('/\s+\S+/', $nomeEco)) { $nomeEco .= ' Silva'; }
            $nomeEco = preg_replace('/[^A-Za-zÀ-ÿ\s\.\-]/u', '', $nomeEco);
            $nomeEco = preg_replace('/\s+/', ' ', trim($nomeEco));
            if (mb_strlen($nomeEco) < 4) { $nomeEco = 'Cliente Jumpcash'; }

            $params = [
                'client_id' => (string)$this->cfg['client_id'],
                'client_secret' => (string)$this->cfg['client_secret'],
                'nome' => $nomeEco,
                'cpf' => $cpf,
                'valor' => number_format($amount, 2, '.', ''),
                'descricao' => (string)($payload['descricao'] ?? 'Deposito Tower Slot'),
            ];
            if (!empty($payload['webhook_url'])) {
                $params['urlnoty'] = (string)$payload['webhook_url'];
            }

            $res = $this->requestForm('POST', 'pix/qrcode.php', $params);
            if ($res['status'] < 200 || $res['status'] >= 300) {
                throw new RuntimeException('Erro Ecompag: ' . json_encode($res['body'], JSON_UNESCAPED_UNICODE));
            }

            $b = $res['body'];
            $txid = (string)($b['transactionId'] ?? $b['reference_code'] ?? '');
            if ($txid === '') {
                $txid = 'ECO-' . uniqid();
            }

            return [
                'txid' => $txid,
                'qrcode_texto' => (string)($b['qrcode'] ?? $b['qr_code'] ?? $b['pix_copia_cola'] ?? ''),
                'qrcode_imagem' => $this->normalizeQrImage((string)($b['qrcode_image'] ?? $b['qr_image'] ?? '')),
                'expiracao_minutos' => (int)($b['expires_in_minutes'] ?? 30),
                'provider_ref' => (string)($b['transactionId'] ?? $txid),
                'status' => 'pendente',
                'meta' => $b,
            ];
        }

        // Compatibilidade com modo legado baseado em API key.
        $res = $this->requestBearerLegacy('POST', 'pix/deposit', [
            'amount' => $amount,
            'name' => (string)($payload['nome'] ?? ''),
            'email' => (string)($payload['email'] ?? ''),
            'cpf' => preg_replace('/\D+/', '', (string)($payload['cpf'] ?? '')),
            'phone' => preg_replace('/\D+/', '', (string)($payload['telefone'] ?? '')),
            'callback_url' => (string)($payload['webhook_url'] ?? ''),
            'external_reference' => (string)($payload['external_reference'] ?? ''),
        ]);

        if ($res['status'] < 200 || $res['status'] >= 300) {
            throw new RuntimeException('Erro Ecompag (legacy): ' . json_encode($res['body'], JSON_UNESCAPED_UNICODE));
        }

        $b = $res['body'];
        return [
            'txid' => (string)($b['txid'] ?? $b['id'] ?? ('ECO-' . uniqid())),
            'qrcode_texto' => (string)($b['pix_copia_cola'] ?? $b['qr_code'] ?? ''),
            'qrcode_imagem' => $this->normalizeQrImage((string)($b['qr_image'] ?? '')),
            'expiracao_minutos' => (int)($b['expires_in_minutes'] ?? 30),
            'provider_ref' => (string)($b['id'] ?? $b['txid'] ?? ''),
            'status' => 'pendente',
            'meta' => $b,
        ];
    }

    public function getDepositStatus(array $deposit): array
    {
        $ref = (string)($deposit['provider_ref'] ?: $deposit['txid']);
        if ($ref === '') {
            return ['status' => 'pendente'];
        }

        if ($this->usingClientCredentials()) {
            $res = $this->requestForm('GET', 'pix/status.php', [
                'client_id' => (string)$this->cfg['client_id'],
                'client_secret' => (string)$this->cfg['client_secret'],
                'transaction_id' => $ref,
            ]);

            if ($res['status'] < 200 || $res['status'] >= 300) {
                return ['status' => 'pendente'];
            }

            $t = $res['body']['transaction'] ?? [];
            $statusRaw = strtoupper((string)($t['status'] ?? $res['body']['status'] ?? 'PENDING'));
            if ($statusRaw === 'PAID') {
                return ['status' => 'aprovado', 'valor' => (float)($t['amount'] ?? $deposit['valor'])];
            }
            if (in_array($statusRaw, ['FAILED', 'CANCELLED'], true)) {
                return ['status' => 'cancelado'];
            }

            return ['status' => 'pendente'];
        }

        // Compatibilidade com modo legado baseado em API key.
        $res = $this->requestBearerLegacy('GET', 'pix/deposit/status/' . urlencode($ref));
        if ($res['status'] < 200 || $res['status'] >= 300) {
            return ['status' => 'pendente'];
        }

        $statusRaw = strtolower((string)($res['body']['status'] ?? 'pending'));
        if (in_array($statusRaw, ['approved', 'paid', 'completed', 'success'], true)) {
            return ['status' => 'aprovado', 'valor' => (float)($res['body']['amount'] ?? $deposit['valor'])];
        }
        if (in_array($statusRaw, ['cancelled', 'rejected', 'expired', 'failed'], true)) {
            return ['status' => 'cancelado'];
        }

        return ['status' => 'pendente'];
    }
}
