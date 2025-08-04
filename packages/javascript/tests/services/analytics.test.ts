import { AnalyticsService } from '../../src/services/analytics'
import { HttpClient } from '../../src/http-client'
import { AnalyticsOverview } from '../../src/types'

jest.mock('../../src/http-client')

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService
  let mockHttpClient: jest.Mocked<HttpClient>

  beforeEach(() => {
    mockHttpClient = new HttpClient({ apiKey: 'pk_test_123' }) as jest.Mocked<HttpClient>
    analyticsService = new AnalyticsService(mockHttpClient)
  })

  describe('overview', () => {
    it('should get analytics overview with default parameters', async () => {
      const mockOverview: AnalyticsOverview = {
        period: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-31T23:59:59Z'
        },
        emails: {
          sent: 1000,
          delivered: 950,
          failed: 25,
          bounced: 20,
          complained: 5
        },
        engagement: {
          opens: 500,
          clicks: 100,
          openRate: 0.526,
          clickRate: 0.105
        },
        reputation: {
          score: 85,
          status: 'good'
        }
      }

      const mockResponse = {
        success: true,
        data: mockOverview,
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await analyticsService.overview()

      expect(result).toEqual(mockOverview)
      expect(mockHttpClient.get).toHaveBeenCalledWith('/analytics/overview?')
    })

    it('should get analytics overview with date range and tags', async () => {
      const request = {
        startDate: new Date('2024-01-01'),
        endDate: '2024-01-31',
        tags: ['marketing', 'newsletter']
      }

      const mockOverview: AnalyticsOverview = {
        period: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-31T23:59:59Z'
        },
        emails: {
          sent: 500,
          delivered: 480,
          failed: 10,
          bounced: 8,
          complained: 2
        },
        engagement: {
          opens: 300,
          clicks: 75,
          openRate: 0.625,
          clickRate: 0.156
        },
        reputation: {
          score: 90,
          status: 'excellent'
        }
      }

      const mockResponse = {
        success: true,
        data: mockOverview,
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await analyticsService.overview(request)

      expect(result).toEqual(mockOverview)
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/analytics/overview?start_date=2024-01-01T00%3A00%3A00.000Z&end_date=2024-01-31&tags%5B%5D=marketing&tags%5B%5D=newsletter'
      )
    })

    it('should throw error on failed request', async () => {
      const mockResponse = {
        success: false,
        error: { code: 'ANALYTICS_ERROR', message: 'Failed to get analytics' },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      await expect(analyticsService.overview()).rejects.toThrow('Failed to get analytics')
    })
  })

  describe('engagement', () => {
    it('should get engagement analytics', async () => {
      const mockEngagement = {
        opens: 1000,
        clicks: 200,
        openRate: 0.5,
        clickRate: 0.1,
        topLinks: [
          { url: 'https://example.com', clicks: 100 },
          { url: 'https://example.com/product', clicks: 50 }
        ]
      }

      const mockResponse = {
        success: true,
        data: mockEngagement,
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await analyticsService.engagement()

      expect(result).toEqual(mockEngagement)
      expect(mockHttpClient.get).toHaveBeenCalledWith('/analytics/engagement?')
    })

    it('should get engagement analytics with filters', async () => {
      const request = {
        startDate: '2024-01-01',
        endDate: new Date('2024-01-31'),
        tags: ['campaign1']
      }

      const mockResponse = {
        success: true,
        data: { opens: 100, clicks: 20 },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      await analyticsService.engagement(request)

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/analytics/engagement?start_date=2024-01-01&end_date=2024-01-31T00%3A00%3A00.000Z&tags%5B%5D=campaign1'
      )
    })

    it('should throw error on failed engagement request', async () => {
      const mockResponse = {
        success: false,
        error: { code: 'ENGAGEMENT_ERROR', message: 'Failed to get engagement' },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      await expect(analyticsService.engagement()).rejects.toThrow('Failed to get engagement')
    })
  })

  describe('reputation', () => {
    it('should get reputation analytics', async () => {
      const mockReputation = {
        score: 95,
        status: 'excellent',
        factors: {
          deliverability: 98,
          engagement: 92,
          complaints: 5,
          bounces: 3
        }
      }

      const mockResponse = {
        success: true,
        data: mockReputation,
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await analyticsService.reputation()

      expect(result).toEqual(mockReputation)
      expect(mockHttpClient.get).toHaveBeenCalledWith('/analytics/reputation')
    })

    it('should throw error on failed reputation request', async () => {
      const mockResponse = {
        success: false,
        error: { code: 'REPUTATION_ERROR', message: 'Failed to get reputation' },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      await expect(analyticsService.reputation()).rejects.toThrow('Failed to get reputation')
    })
  })
})