<?php

declare(strict_types=1);

namespace App\Providers;

use RuntimeException;

final class MercadoPagoProvider implements PaymentProviderInterface
{
    public function __construct(private readonly array $cfg)
    {
    }

    private function request(string $method, string $url, array $headers = [], ?array $body = null): array
    {
        $ch = curl_init($url);
        $httpHeaders = array_merge(['Content-Type: application/json'], $headers);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $httpHeaders,
            CURLOPT_TIMEOUT => 20,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE));
        }

        $resp = curl_exec($ch);
        $err = curl_error($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false) {
            throw new RuntimeException('Falha HTTP Mercado Pago: ' . $err);
        }

        $json = json_decode($resp, true);
        if (!is_array($json)) {
            $json = ['raw' => $resp];
        }

        return ['status' => $code, 'body' => $json];
    }

    public function createDeposit(array $payload): array
    {
        $token = $this->cfg['access_token'] ?? '';
        if (!$token) {
            throw new RuntimeException('MP_ACCESS_TOKEN não configurado.');
        }

        $idemp = 'dep-' . uniqid('', true);
        $amount = round((float)$payload['valor'], 2);

        $body = [
            'transaction_amount' => $amount,
            'description' => 'Depósito Tower Slot',
            'payment_method_id' => 'pix',
            'payer' => [
                'email' => $payload['email'] ?: 'cliente@towerslot.local',
                'first_name' => $payload['nome'] ?: 'Cliente',
                'identification' => [
                    'type' => 'CPF',
                    'number' => preg_replace('/\D+/', '', (string)($payload['cpf'] ?? '')),
                ],
            ],
            'notification_url' => ($payload['webhook_url'] ?? ''),
        ];

        $res = $this->request(
            'POST',
            'https://api.mercadopago.com/v1/payments',
            [
                'Authorization: Bearer ' . $token,
                'X-Idempotency-Key: ' . $idemp,
            ],
            $body
        );

        if ($res['status'] < 200 || $res['status'] >= 300) {
            throw new RuntimeException('Erro Mercado Pago: ' . json_encode($res['body'], JSON_UNESCAPED_UNICODE));
        }

        $b = $res['body'];
        $txid = (string)($b['id'] ?? '');
        $qr = (string)($b['point_of_interaction']['transaction_data']['qr_code'] ?? '');
        $qrImg = (string)($b['point_of_interaction']['transaction_data']['qr_code_base64'] ?? '');
        if ($qrImg) {
            $qrImg = 'data:image/png;base64,' . $qrImg;
        }

        return [
            'txid' => $txid ?: ('MP-' . uniqid()),
            'qrcode_texto' => $qr,
            'qrcode_imagem' => $qrImg,
            'expiracao_minutos' => 30,
            'provider_ref' => $txid,
            'status' => 'pendente',
            'meta' => $b,
        ];
    }

    public function getDepositStatus(array $deposit): array
    {
        $token = $this->cfg['access_token'] ?? '';
        if (!$token) {
            throw new RuntimeException('MP_ACCESS_TOKEN não configurado.');
        }

        $ref = $deposit['provider_ref'] ?: $deposit['txid'];
        $res = $this->request(
            'GET',
            'https://api.mercadopago.com/v1/payments/' . urlencode((string)$ref),
            ['Authorization: Bearer ' . $token]
        );

        if ($res['status'] < 200 || $res['status'] >= 300) {
            return ['status' => 'pendente'];
        }

        $status = strtolower((string)($res['body']['status'] ?? 'pending'));
        if (in_array($status, ['approved'], true)) {
            return ['status' => 'aprovado', 'valor' => (float)($res['body']['transaction_amount'] ?? $deposit['valor'])];
        }

        if (in_array($status, ['cancelled', 'rejected', 'refunded', 'charged_back'], true)) {
            return ['status' => 'cancelado'];
        }

        return ['status' => 'pendente'];
    }
}

