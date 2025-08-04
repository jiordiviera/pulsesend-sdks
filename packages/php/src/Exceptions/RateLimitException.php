<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class RateLimitException extends PulseSendException
{
    private int $retryAfter;

    public function __construct(string $message = '', int $retryAfter = 0, array $details = [], int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $details, $code, $previous);
        $this->retryAfter = $retryAfter;
    }

    public function getRetryAfter(): int
    {
        return $this->retryAfter;
    }

    public function getErrorCode(): string
    {
        return 'RATE_LIMITED';
    }
}