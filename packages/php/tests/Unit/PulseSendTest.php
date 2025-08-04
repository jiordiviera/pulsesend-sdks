<?php

declare(strict_types=1);

namespace PulseSend\Tests\Unit;

use PHPUnit\Framework\TestCase;
use PulseSend\PulseSend;
use PulseSend\Services\EmailsService;
use PulseSend\Services\AnalyticsService;

class PulseSendTest extends TestCase
{
    private PulseSend $pulseSend;

    protected function setUp(): void
    {
        $this->pulseSend = new PulseSend('pk_test_key');
    }

    public function testConstructorWithApiKey(): void
    {
        $client = new PulseSend('pk_test_key');
        
        $this->assertInstanceOf(PulseSend::class, $client);
        $this->assertInstanceOf(EmailsService::class, $client->emails());
        $this->assertInstanceOf(AnalyticsService::class, $client->analytics());
    }

    public function testConstructorWithConfig(): void
    {
        $client = new PulseSend('pk_test_key', [
            'base_url' => 'https://custom.api.com',
            'timeout' => 30,
            'retries' => 5,
            'retry_delay' => 2
        ]);
        
        $this->assertInstanceOf(PulseSend::class, $client);
    }

    public function testEmailsService(): void
    {
        $emails = $this->pulseSend->emails();
        
        $this->assertInstanceOf(EmailsService::class, $emails);
    }

    public function testAnalyticsService(): void
    {
        $analytics = $this->pulseSend->analytics();
        
        $this->assertInstanceOf(AnalyticsService::class, $analytics);
    }

    public function testVersion(): void
    {
        $version = PulseSend::version();
        
        $this->assertIsString($version);
        $this->assertMatchesRegularExpression('/^\d+\.\d+\.\d+$/', $version);
    }
}