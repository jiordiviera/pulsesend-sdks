<?php

declare(strict_types=1);

namespace PulseSend;

class Configuration
{
    private string $apiKey;
    private string $baseUrl;
    private int $timeout;
    private int $retries;
    private int $retryDelay;

    public function __construct(
        string $apiKey,
        string $baseUrl = 'https://api.pulsesend.com/v1',
        int $timeout = 10,
        int $retries = 3,
        int $retryDelay = 1
    ) {
        if (empty($apiKey)) {
            throw new \InvalidArgumentException('API key is required');
        }

        if (!str_starts_with($apiKey, 'pk_')) {
            throw new \InvalidArgumentException('Invalid API key format. API key should start with "pk_"');
        }

        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
        $this->retries = max(0, $retries);
        $this->retryDelay = max(1, $retryDelay);
    }

    public function getApiKey(): string
    {
        return $this->apiKey;
    }

    public function getBaseUrl(): string
    {
        return $this->baseUrl;
    }

    public function getTimeout(): int
    {
        return $this->timeout;
    }

    public function getRetries(): int
    {
        return $this->retries;
    }

    public function getRetryDelay(): int
    {
        return $this->retryDelay;
    }
}