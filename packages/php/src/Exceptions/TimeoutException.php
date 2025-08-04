<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class TimeoutException extends PulseSendException
{
    public function getErrorCode(): string
    {
        return 'TIMEOUT_ERROR';
    }
}