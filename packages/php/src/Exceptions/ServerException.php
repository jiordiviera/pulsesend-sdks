<?php

declare(strict_types=1);

namespace PulseSend\Exceptions;

class ServerException extends PulseSendException
{
    private int $statusCode;

    public function __construct(string $message = '', int $statusCode = 500, array $details = [], int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $details, $code, $previous);
        $this->statusCode = $statusCode;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrorCode(): string
    {
        return 'SERVER_ERROR';
    }
}