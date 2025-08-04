<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class QuotaExceededException extends PulseSendException
{
    public function getErrorCode(): string
    {
        return 'QUOTA_EXCEEDED';
    }
}