<?php

declare(strict_types=1);

namespace PulseSend\Tests\Unit\Exceptions;

use PHPUnit\Framework\TestCase;
use PulseSend\Exceptions\InvalidApiKeyException;
use PulseSend\Exceptions\NetworkException;
use PulseSend\Exceptions\PulseSendException;
use PulseSend\Exceptions\QuotaExceededException;
use PulseSend\Exceptions\RateLimitException;
use PulseSend\Exceptions\ServerException;
use PulseSend\Exceptions\TimeoutException;
use PulseSend\Exceptions\ValidationException;

class ExceptionsTest extends TestCase
{
    public function testInvalidApiKeyException(): void
    {
        $exception = new InvalidApiKeyException('Invalid API key');
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Invalid API key', $exception->getMessage());
        $this->assertEquals('INVALID_API_KEY', $exception->getErrorCode());
        $this->assertEquals([], $exception->getDetails());
    }

    public function testQuotaExceededException(): void
    {
        $details = ['limit' => 1000, 'used' => 1001];
        $exception = new QuotaExceededException('Quota exceeded', $details);
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Quota exceeded', $exception->getMessage());
        $this->assertEquals('QUOTA_EXCEEDED', $exception->getErrorCode());
        $this->assertEquals($details, $exception->getDetails());
    }

    public function testRateLimitException(): void
    {
        $exception = new RateLimitException('Rate limited', 60);
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Rate limited', $exception->getMessage());
        $this->assertEquals('RATE_LIMITED', $exception->getErrorCode());
        $this->assertEquals(60, $exception->getRetryAfter());
    }

    public function testValidationException(): void
    {
        $details = ['field' => 'email', 'error' => 'invalid format'];
        $exception = new ValidationException('Validation failed', $details);
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Validation failed', $exception->getMessage());
        $this->assertEquals('VALIDATION_ERROR', $exception->getErrorCode());
        $this->assertEquals($details, $exception->getDetails());
    }

    public function testNetworkException(): void
    {
        $exception = new NetworkException('Network error');
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Network error', $exception->getMessage());
        $this->assertEquals('NETWORK_ERROR', $exception->getErrorCode());
    }

    public function testTimeoutException(): void
    {
        $exception = new TimeoutException('Request timeout');
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Request timeout', $exception->getMessage());
        $this->assertEquals('TIMEOUT_ERROR', $exception->getErrorCode());
    }

    public function testServerException(): void
    {
        $details = ['error' => 'Internal server error'];
        $exception = new ServerException('Server error', 500, $details);
        
        $this->assertInstanceOf(PulseSendException::class, $exception);
        $this->assertEquals('Server error', $exception->getMessage());
        $this->assertEquals('SERVER_ERROR', $exception->getErrorCode());
        $this->assertEquals(500, $exception->getStatusCode());
        $this->assertEquals($details, $exception->getDetails());
    }

    public function testPulseSendExceptionWithPrevious(): void
    {
        $previous = new \Exception('Previous exception');
        $exception = new NetworkException('Network error', [], 0, $previous);
        
        $this->assertSame($previous, $exception->getPrevious());
    }
}