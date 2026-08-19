<?php

declare(strict_types=1);

namespace App\Providers;

use App\Core\Util;

final class MockProvider implements PaymentProviderInterface
{
    public function createDeposit(array $payload): array
    {
        $txid = Util::randomRef('MOCK');
        $valor = number_format((float)$payload['valor'], 2, '.', '');

        return [
            'txid' => $txid,
            'qrcode_texto' => '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540' . $valor . '5802BR5910TOWER SLOT6009SAO PAULO62070503***6304ABCD',
            'qrcode_imagem' => '',
            'expiracao_minutos' => 30,
            'provider_ref' => $txid,
            'status' => 'pendente',
            'meta' => ['mock' => true],
        ];
    }

    public function getDepositStatus(array $deposit): array
    {
        // Nao aprovar automaticamente. O saldo so deve ser creditado quando o gateway
        // real confirmar o pagamento via webhook ou consulta de status.
        return ['status' => 'pendente'];
    }
}
