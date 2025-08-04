import axios, { AxiosResponse } from 'axios'
import { HttpClient } from '../src/http-client'
import {
  InvalidApiKeyError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ServerError
} from '../src/errors'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('HttpClient', () => {
  let httpClient: HttpClient
  let mockAxiosInstance: jest.Mocked<any>

  beforeEach(() => {
    mockAxiosInstance = {
      request: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn()
        }
      }
    }
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance)
    
    httpClient = new HttpClient({
      apiKey: 'pk_test_123',
      baseUrl: 'https://api.test.com',
      timeout: 5000,
      retries: 2,
      retryDelay: 500
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.test.com',
        timeout: 5000,
        headers: {
          'Authorization': 'Bearer pk_test_123',
          'Content-Type': 'application/json',
          'User-Agent': '@pulsesend/javascript/0.1.0'
        }
      })
    })

    it('should use default config values', () => {
      mockedAxios.create.mockClear()
      new HttpClient({ apiKey: 'pk_test_123' })
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.pulsesend.com/v1',
        timeout: 10000,
        headers: {
          'Authorization': 'Bearer pk_test_123',
          'Content-Type': 'application/json',
          'User-Agent': '@pulsesend/javascript/0.1.0'
        }
      })
    })
  })

  describe('request', () => {
    it('should make successful request', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' },
          requestId: 'req_123'
        }
      }
      
      mockAxiosInstance.request.mockResolvedValue(mockResponse)
      
      const result = await httpClient.request({ method: 'GET', url: '/test' })
      
      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({ method: 'GET', url: '/test' })
    })

    it('should retry on network error', async () => {
      const networkError = new NetworkError('Network failed')
      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' },
          requestId: 'req_123'
        }
      }
      
      mockAxiosInstance.request
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue(mockResponse)
      
      const result = await httpClient.request({ method: 'GET', url: '/test' })
      
      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2)
    })

    it('should retry on server error', async () => {
      const serverError = new ServerError('Server error', 500)
      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' },
          requestId: 'req_123'
        }
      }
      
      mockAxiosInstance.request
        .mockRejectedValueOnce(serverError)
        .mockResolvedValue(mockResponse)
      
      const result = await httpClient.request({ method: 'GET', url: '/test' })
      
      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2)
    })

    it('should not retry on validation error', async () => {
      const validationError = new ValidationError('Invalid data')
      
      mockAxiosInstance.request.mockRejectedValue(validationError)
      
      await expect(httpClient.request({ method: 'POST', url: '/test' }))
        .rejects.toThrow(ValidationError)
      
      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(1)
    })

    it('should handle rate limit with retry after', async () => {
      const rateLimitError = new RateLimitError('Rate limited', 1)
      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' },
          requestId: 'req_123'
        }
      }
      
      mockAxiosInstance.request
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue(mockResponse)
      
      const startTime = Date.now()
      const result = await httpClient.request({ method: 'GET', url: '/test' })
      const endTime = Date.now()
      
      expect(result).toEqual(mockResponse.data)
      expect(endTime - startTime).toBeGreaterThan(900) // Should wait ~1 second
      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2)
    })

    it('should throw error after max retries', async () => {
      const networkError = new NetworkError('Network failed')
      
      mockAxiosInstance.request.mockRejectedValue(networkError)
      
      await expect(httpClient.request({ method: 'GET', url: '/test' }))
        .rejects.toThrow(NetworkError)
      
      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('HTTP methods', () => {
    beforeEach(() => {
      jest.spyOn(httpClient, 'request').mockResolvedValue({
        success: true,
        data: { result: 'success' },
        requestId: 'req_123'
      })
    })

    it('should make GET request', async () => {
      await httpClient.get('/test', { params: { q: 'search' } })
      
      expect(httpClient.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        params: { q: 'search' }
      })
    })

    it('should make POST request', async () => {
      const data = { name: 'test' }
      await httpClient.post('/test', data, { headers: { 'X-Custom': 'value' } })
      
      expect(httpClient.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data,
        headers: { 'X-Custom': 'value' }
      })
    })

    it('should make PUT request', async () => {
      const data = { id: 1, name: 'updated' }
      await httpClient.put('/test/1', data)
      
      expect(httpClient.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/test/1',
        data
      })
    })

    it('should make DELETE request', async () => {
      await httpClient.delete('/test/1')
      
      expect(httpClient.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/test/1'
      })
    })
  })
})