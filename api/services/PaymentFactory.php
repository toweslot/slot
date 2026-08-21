<?php

declare(strict_types=1);

namespace App\Services;

use App\Providers\AmploPayProvider;
use App\Providers\EcoPagProvider;
use App\Providers\MercadoPagoProvider;
use App\Providers\MockProvider;
use App\Providers\PaymentProviderInterface;
use App\Providers\SigiloPayProvider;

final class PaymentFactory
{
    public static function make(array $config): PaymentProviderInterface
    {
        $provider = strtolower((string)($config['payment']['provider'] ?? 'mock'));

        return match ($provider) {
            'mercadopago', 'mp' => new MercadoPagoProvider($config['payment']['mercadopago'] ?? []),
            'ecompag', 'ecopag' => new EcoPagProvider($config['payment']['ecompag'] ?? ($config['payment']['ecopag'] ?? [])),
            'sigilopay', 'sigilo' => new SigiloPayProvider($config['payment']['sigilopay'] ?? []),
            'amplopay', 'amplo' => new AmploPayProvider($config['payment']['amplopay'] ?? []),
            default => new MockProvider(),
        };
    }
}

