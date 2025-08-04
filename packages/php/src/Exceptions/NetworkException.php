<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class NetworkException extends PulseSendException
{
    public function getErrorCode(): string
    {
        return 'NETWORK_ERROR';
    }
}