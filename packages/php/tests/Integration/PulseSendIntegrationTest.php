<?php

declare(strict_types=1);

namespace PulseSend\Tests\Integration;

use PHPUnit\Framework\TestCase;
use PulseSend\PulseSend;

class PulseSendIntegrationTest extends TestCase
{
    private PulseSend $pulseSend;

    protected function setUp(): void
    {
        $apiKey = $_ENV['PULSESEND_API_KEY'] ?? 'pk_test_key_for_testing';
        $this->pulseSend = new PulseSend($apiKey, [
            'base_url' => $_ENV['PULSESEND_BASE_URL'] ?? 'https://api.pulsesend.com/v1'
        ]);
    }

    public function testClientCreation(): void
    {
        $this->assertInstanceOf(PulseSend::class, $this->pulseSend);
    }

    public function testInvalidApiKeyThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        
        new PulseSend('invalid_key');
    }

    public function testServicesAreAccessible(): void
    {
        $emails = $this->pulseSend->emails();
        $analytics = $this->pulseSend->analytics();
        
        $this->assertNotNull($emails);
        $this->assertNotNull($analytics);
    }

    public function testVersionIsAccessible(): void
    {
        $version = PulseSend::version();
        
        $this->assertIsString($version);
        $this->assertNotEmpty($version);
    }

    public function testEmailValidation(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Field \'to\' is required');
        
        $this->pulseSend->emails()->send([
            'from' => 'test@example.com',
            'subject' => 'Test',
            'html' => '<h1>Test</h1>'
        ]);
    }
}