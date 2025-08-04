<?php

declare(strict_types=1);

namespace PulseSend\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use Mockery;
use PulseSend\HttpClient;
use PulseSend\Services\EmailsService;

class EmailsServiceTest extends TestCase
{
    private EmailsService $emailsService;
    private HttpClient $httpClient;

    protected function setUp(): void
    {
        $this->httpClient = Mockery::mock(HttpClient::class);
        $this->emailsService = new EmailsService($this->httpClient);
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testSendEmailWithValidData(): void
    {
        $emailData = [
            'to' => ['test@example.com'],
            'from' => 'sender@example.com',
            'subject' => 'Test Subject',
            'html' => '<h1>Test Email</h1>'
        ];
        
        $expectedResponse = [
            'id' => 'email_123',
            'message_id' => 'msg_456',
            'status' => 'queued'
        ];
        
        $this->httpClient->shouldReceive('post')
            ->once()
            ->with('/emails', $emailData)
            ->andReturn($expectedResponse);
        
        $result = $this->emailsService->send($emailData);
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testSendEmailWithRecipientArray(): void
    {
        $emailData = [
            'to' => [
                ['email' => 'test@example.com', 'name' => 'Test User']
            ],
            'from' => ['email' => 'sender@example.com', 'name' => 'Sender'],
            'subject' => 'Test Subject',
            'text' => 'Test email content'
        ];
        
        $this->httpClient->shouldReceive('post')
            ->once()
            ->andReturn(['id' => 'email_123']);
        
        $result = $this->emailsService->send($emailData);
        
        $this->assertArrayHasKey('id', $result);
    }

    public function testSendEmailMissingToFieldThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Field \'to\' is required');
        
        $this->emailsService->send([
            'from' => 'sender@example.com',
            'subject' => 'Test Subject',
            'html' => '<h1>Test</h1>'
        ]);
    }

    public function testSendEmailMissingFromFieldThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Field \'from\' is required');
        
        $this->emailsService->send([
            'to' => ['test@example.com'],
            'subject' => 'Test Subject',
            'html' => '<h1>Test</h1>'
        ]);
    }

    public function testSendEmailMissingSubjectFieldThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Field \'subject\' is required');
        
        $this->emailsService->send([
            'to' => ['test@example.com'],
            'from' => 'sender@example.com',
            'html' => '<h1>Test</h1>'
        ]);
    }

    public function testSendEmailMissingContentThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('At least one of html, text, or template_id is required');
        
        $this->emailsService->send([
            'to' => ['test@example.com'],
            'from' => 'sender@example.com',
            'subject' => 'Test Subject'
        ]);
    }

    public function testSendEmailInvalidEmailThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid email address: invalid-email');
        
        $this->emailsService->send([
            'to' => ['invalid-email'],
            'from' => 'sender@example.com',
            'subject' => 'Test Subject',
            'html' => '<h1>Test</h1>'
        ]);
    }

    public function testListEmails(): void
    {
        $params = ['limit' => 10, 'status' => 'sent'];
        $expectedResponse = [
            'data' => [],
            'pagination' => [
                'total' => 0,
                'count' => 0,
                'offset' => 0,
                'limit' => 10,
                'has_more' => false
            ]
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with('/emails', $params)
            ->andReturn($expectedResponse);
        
        $result = $this->emailsService->list($params);
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testGetEmail(): void
    {
        $emailId = 'email_123';
        $expectedResponse = [
            'id' => $emailId,
            'status' => 'sent'
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with("/emails/{$emailId}")
            ->andReturn($expectedResponse);
        
        $result = $this->emailsService->get($emailId);
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testCancelEmail(): void
    {
        $emailId = 'email_123';
        $expectedResponse = ['success' => true];
        
        $this->httpClient->shouldReceive('delete')
            ->once()
            ->with("/emails/{$emailId}")
            ->andReturn($expectedResponse);
        
        $result = $this->emailsService->cancel($emailId);
        
        $this->assertEquals($expectedResponse, $result);
    }
}