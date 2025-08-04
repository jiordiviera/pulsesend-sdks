<?php

declare(strict_types=1);

namespace PulseSend;

use PulseSend\Services\EmailsService;
use PulseSend\Services\AnalyticsService;

class PulseSend
{
    private HttpClient $httpClient;
    private EmailsService $emails;
    private AnalyticsService $analytics;

    public function __construct(string $apiKey, array $config = [])
    {
        $configuration = new Configuration(
            $apiKey,
            $config['base_url'] ?? 'https://api.pulsesend.com/v1',
            $config['timeout'] ?? 10,
            $config['retries'] ?? 3,
            $config['retry_delay'] ?? 1
        );

        $this->httpClient = new HttpClient($configuration);
        $this->emails = new EmailsService($this->httpClient);
        $this->analytics = new AnalyticsService($this->httpClient);
    }

    public function emails(): EmailsService
    {
        return $this->emails;
    }

    public function analytics(): AnalyticsService
    {
        return $this->analytics;
    }

    public function ping(): array
    {
        return $this->httpClient->get('/ping');
    }

    public static function version(): string
    {
        return '1.0.0';
    }
}