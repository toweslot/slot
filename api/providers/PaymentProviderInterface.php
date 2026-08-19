<?php

declare(strict_types=1);

namespace App\Providers;

interface PaymentProviderInterface
{
    public function createDeposit(array $payload): array;
    public function getDepositStatus(array $deposit): array;
}

