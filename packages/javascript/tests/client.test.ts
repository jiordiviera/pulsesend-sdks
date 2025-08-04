import { PulseSend } from '../src/client'
import { InvalidApiKeyError } from '../src/errors'

describe('PulseSend Client', () => {
  describe('constructor', () => {
    it('should create client with API key string', () => {
      const client = new PulseSend('pk_test_123')
      expect(client).toBeInstanceOf(PulseSend)
      expect(client.emails).toBeDefined()
      expect(client.analytics).toBeDefined()
    })

    it('should create client with config object', () => {
      const client = new PulseSend({
        apiKey: 'pk_test_123',
        baseUrl: 'https://custom.api.com'
      })
      expect(client).toBeInstanceOf(PulseSend)
    })

    it('should throw error if no API key provided', () => {
      expect(() => {
        new PulseSend('')
      }).toThrow('API key is required')
    })

    it('should throw error for invalid API key format', () => {
      expect(() => {
        new PulseSend('invalid_key')
      }).toThrow('Invalid API key format. API key should start with "pk_"')
    })
  })

  describe('version', () => {
    it('should return version string', () => {
      expect(PulseSend.version).toBe('0.1.0')
    })
  })

  describe('ping', () => {
    let client: PulseSend

    beforeEach(() => {
      client = new PulseSend('pk_test_123')
    })

    it('should make ping request', async () => {
      const mockResponse = {
        success: true,
        data: { status: 'ok', timestamp: '2023-01-01T00:00:00Z' },
        requestId: 'req_123'
      }

      const httpClient = (client as any).httpClient
      jest.spyOn(httpClient, 'get').mockResolvedValue(mockResponse)

      const result = await client.ping()
      
      expect(result).toEqual({
        status: 'ok',
        timestamp: '2023-01-01T00:00:00Z'
      })
      expect(httpClient.get).toHaveBeenCalledWith('/ping')
    })

    it('should throw error on failed ping', async () => {
      const mockResponse = {
        success: false,
        error: { code: 'PING_FAILED', message: 'Ping failed' },
        requestId: 'req_123'
      }

      const httpClient = (client as any).httpClient
      jest.spyOn(httpClient, 'get').mockResolvedValue(mockResponse)

      await expect(client.ping()).rejects.toThrow('Ping failed')
    })
  })
})