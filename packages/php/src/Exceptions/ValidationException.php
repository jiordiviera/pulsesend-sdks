<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class ValidationException extends PulseSendException
{
    public function getErrorCode(): string
    {
        return 'VALIDATION_ERROR';
    }
}