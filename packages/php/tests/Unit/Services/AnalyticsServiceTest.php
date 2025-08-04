<?php

declare(strict_types=1);

namespace PulseSend\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use Mockery;
use PulseSend\HttpClient;
use PulseSend\Services\AnalyticsService;

class AnalyticsServiceTest extends TestCase
{
    private AnalyticsService $analyticsService;
    private HttpClient $httpClient;

    protected function setUp(): void
    {
        $this->httpClient = Mockery::mock(HttpClient::class);
        $this->analyticsService = new AnalyticsService($this->httpClient);
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testOverview(): void
    {
        $params = ['start_date' => '2023-01-01', 'end_date' => '2023-12-31'];
        $expectedResponse = [
            'period' => [
                'start' => '2023-01-01T00:00:00Z',
                'end' => '2023-12-31T23:59:59Z'
            ],
            'emails' => [
                'sent' => 1000,
                'delivered' => 950,
                'failed' => 25,
                'bounced' => 15,
                'complained' => 10
            ],
            'engagement' => [
                'opens' => 600,
                'clicks' => 200,
                'open_rate' => 0.63,
                'click_rate' => 0.21
            ],
            'reputation' => [
                'score' => 85,
                'status' => 'good'
            ]
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with('/analytics/overview', $params)
            ->andReturn($expectedResponse);
        
        $result = $this->analyticsService->overview($params);
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testOverviewWithoutParams(): void
    {
        $expectedResponse = [
            'period' => [
                'start' => '2023-12-01T00:00:00Z',
                'end' => '2023-12-31T23:59:59Z'
            ],
            'emails' => [
                'sent' => 100,
                'delivered' => 95,
                'failed' => 3,
                'bounced' => 1,
                'complained' => 1
            ]
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with('/analytics/overview', [])
            ->andReturn($expectedResponse);
        
        $result = $this->analyticsService->overview();
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testEngagement(): void
    {
        $params = ['tags' => ['newsletter', 'promotion']];
        $expectedResponse = [
            'opens' => 150,
            'clicks' => 45,
            'open_rate' => 0.75,
            'click_rate' => 0.225
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with('/analytics/engagement', $params)
            ->andReturn($expectedResponse);
        
        $result = $this->analyticsService->engagement($params);
        
        $this->assertEquals($expectedResponse, $result);
    }

    public function testReputation(): void
    {
        $expectedResponse = [
            'score' => 92,
            'status' => 'excellent',
            'factors' => [
                'bounce_rate' => 0.02,
                'complaint_rate' => 0.001,
                'spam_rate' => 0.005
            ]
        ];
        
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with('/analytics/reputation')
            ->andReturn($expectedResponse);
        
        $result = $this->analyticsService->reputation();
        
        $this->assertEquals($expectedResponse, $result);
    }
}