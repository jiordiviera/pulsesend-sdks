export abstract class PulseSendError extends Error {
  abstract readonly code: string

  constructor(
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class InvalidApiKeyError extends PulseSendError {
  readonly code = 'INVALID_API_KEY'

  constructor(message = 'Invalid API key provided') {
    super(message)
  }
}

export class QuotaExceededError extends PulseSendError {
  readonly code = 'QUOTA_EXCEEDED'

  constructor(
    message = 'API quota exceeded',
    details?: Record<string, unknown>
  ) {
    super(message, details)
  }
}

export class RateLimitError extends PulseSendError {
  readonly code = 'RATE_LIMITED'

  constructor(
    message = 'Rate limit exceeded',
    public readonly retryAfter?: number
  ) {
    super(message, { retryAfter })
  }
}

export class ValidationError extends PulseSendError {
  readonly code = 'VALIDATION_ERROR'

  constructor(
    message = 'Request validation failed',
    details?: Record<string, unknown>
  ) {
    super(message, details)
  }
}

export class NetworkError extends PulseSendError {
  readonly code = 'NETWORK_ERROR'

  constructor(
    message = 'Network request failed',
    public readonly originalError?: Error
  ) {
    super(message, { originalError: originalError?.message })
  }
}

export class TimeoutError extends PulseSendError {
  readonly code = 'TIMEOUT_ERROR'

  constructor(
    message = 'Request timeout',
    public readonly timeout?: number
  ) {
    super(message, { timeout })
  }
}

export class ServerError extends PulseSendError {
  readonly code = 'SERVER_ERROR'

  constructor(
    message = 'Internal server error',
    public readonly statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message, { statusCode, ...details })
  }
}
