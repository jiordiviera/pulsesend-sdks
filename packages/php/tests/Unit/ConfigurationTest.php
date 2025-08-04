<?php

declare(strict_types=1);

namespace PulseSend\Tests\Unit;

use PHPUnit\Framework\TestCase;
use PulseSend\Configuration;

class ConfigurationTest extends TestCase
{
    public function testValidConfiguration(): void
    {
        $config = new Configuration('pk_test_key');
        
        $this->assertEquals('pk_test_key', $config->getApiKey());
        $this->assertEquals('https://api.pulsesend.com/v1', $config->getBaseUrl());
        $this->assertEquals(10, $config->getTimeout());
        $this->assertEquals(3, $config->getRetries());
        $this->assertEquals(1, $config->getRetryDelay());
    }

    public function testCustomConfiguration(): void
    {
        $config = new Configuration(
            'pk_custom_key',
            'https://custom.api.com',
            30,
            5,
            2
        );
        
        $this->assertEquals('pk_custom_key', $config->getApiKey());
        $this->assertEquals('https://custom.api.com', $config->getBaseUrl());
        $this->assertEquals(30, $config->getTimeout());
        $this->assertEquals(5, $config->getRetries());
        $this->assertEquals(2, $config->getRetryDelay());
    }

    public function testEmptyApiKeyThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('API key is required');
        
        new Configuration('');
    }

    public function testInvalidApiKeyFormatThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid API key format. API key should start with "pk_"');
        
        new Configuration('invalid_key');
    }

    public function testBaseUrlTrailingSlashRemoved(): void
    {
        $config = new Configuration('pk_test_key', 'https://api.example.com/');
        
        $this->assertEquals('https://api.example.com', $config->getBaseUrl());
    }

    public function testNegativeRetriesSetToZero(): void
    {
        $config = new Configuration('pk_test_key', 'https://api.example.com', 10, -1);
        
        $this->assertEquals(0, $config->getRetries());
    }

    public function testNegativeRetryDelaySetToOne(): void
    {
        $config = new Configuration('pk_test_key', 'https://api.example.com', 10, 3, -1);
        
        $this->assertEquals(1, $config->getRetryDelay());
    }
}