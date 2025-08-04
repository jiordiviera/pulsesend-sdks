import {
  PulseSendError,
  InvalidApiKeyError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ServerError
} from '../src/errors'

describe('Error Classes', () => {
  describe('InvalidApiKeyError', () => {
    it('should create error with default message', () => {
      const error = new InvalidApiKeyError()
      
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(PulseSendError)
      expect(error).toBeInstanceOf(InvalidApiKeyError)
      expect(error.name).toBe('InvalidApiKeyError')
      expect(error.code).toBe('INVALID_API_KEY')
      expect(error.message).toBe('Invalid API key provided')
    })

    it('should create error with custom message', () => {
      const error = new InvalidApiKeyError('Custom message')
      
      expect(error.message).toBe('Custom message')
      expect(error.code).toBe('INVALID_API_KEY')
    })
  })

  describe('QuotaExceededError', () => {
    it('should create error with details', () => {
      const details = { limit: 1000, remaining: 0 }
      const error = new QuotaExceededError('Quota exceeded', details)
      
      expect(error.code).toBe('QUOTA_EXCEEDED')
      expect(error.message).toBe('Quota exceeded')
      expect(error.details).toEqual(details)
    })
  })

  describe('RateLimitError', () => {
    it('should create error with retry after', () => {
      const error = new RateLimitError('Rate limited', 60)
      
      expect(error.code).toBe('RATE_LIMITED')
      expect(error.retryAfter).toBe(60)
      expect(error.details).toEqual({ retryAfter: 60 })
    })
  })

  describe('ValidationError', () => {
    it('should create error with validation details', () => {
      const details = { field: 'email', error: 'Invalid format' }
      const error = new ValidationError('Validation failed', details)
      
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.details).toEqual(details)
    })
  })

  describe('NetworkError', () => {
    it('should create error with original error', () => {
      const originalError = new Error('Connection failed')
      const error = new NetworkError('Network error', originalError)
      
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.originalError).toBe(originalError)
      expect(error.details).toEqual({ originalError: 'Connection failed' })
    })
  })

  describe('TimeoutError', () => {
    it('should create error with timeout value', () => {
      const error = new TimeoutError('Request timeout', 5000)
      
      expect(error.code).toBe('TIMEOUT_ERROR')
      expect(error.timeout).toBe(5000)
      expect(error.details).toEqual({ timeout: 5000 })
    })
  })

  describe('ServerError', () => {
    it('should create error with status code and details', () => {
      const details = { requestId: 'req_123' }
      const error = new ServerError('Server error', 500, details)
      
      expect(error.code).toBe('SERVER_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.details).toEqual({ statusCode: 500, requestId: 'req_123' })
    })
  })
})