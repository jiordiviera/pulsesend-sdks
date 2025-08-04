<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class InvalidApiKeyException extends PulseSendException
{
    public function getErrorCode(): string
    {
        return 'INVALID_API_KEY';
    }
}