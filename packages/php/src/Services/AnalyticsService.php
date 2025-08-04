<?php

declare(strict_types=1);

namespace PulseSend\Services;

use PulseSend\HttpClient;

class AnalyticsService
{
    private HttpClient $httpClient;

    public function __construct(HttpClient $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function overview(array $params = []): array
    {
        return $this->httpClient->get('/analytics/overview', $params);
    }

    public function engagement(array $params = []): array
    {
        return $this->httpClient->get('/analytics/engagement', $params);
    }

    public function reputation(): array
    {
        return $this->httpClient->get('/analytics/reputation');
    }
}