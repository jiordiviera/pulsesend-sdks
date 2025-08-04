import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { PulseSendConfig, APIResponse, APIError } from './types'
import {
  InvalidApiKeyError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ServerError,
} from './errors'

export class HttpClient {
  private client: AxiosInstance
  private config: Required<PulseSendConfig>

  constructor(config: PulseSendConfig) {
    this.config = {
      baseUrl: 'https://api.pulsesend.com/v1',
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    }

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': `@pulsesend/javascript/0.1.0`,
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      response => response,
      error => {
        return this.handleError(error)
      }
    )
  }

  private handleError(error: unknown): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: {
          status: number
          data: { error?: APIError }
          headers: Record<string, string>
        }
      }
      const { status, data } = axiosError.response
      const apiError: APIError = data?.error || {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      }

      switch (status) {
        case 401: {
          throw new InvalidApiKeyError(apiError.message)
        }
        case 402: {
          throw new QuotaExceededError(apiError.message, apiError.details)
        }
        case 429: {
          const retryAfterHeader = axiosError.response.headers['retry-after']
          const retryAfter = retryAfterHeader
            ? parseInt(retryAfterHeader)
            : undefined
          throw new RateLimitError(apiError.message, retryAfter)
        }
        case 422: {
          throw new ValidationError(apiError.message, apiError.details)
        }
        case 500:
        case 502:
        case 503:
        case 504: {
          throw new ServerError(apiError.message, status, apiError.details)
        }
        default: {
          throw new ServerError(apiError.message, status, apiError.details)
        }
      }
    } else if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ECONNABORTED'
    ) {
      throw new TimeoutError('Request timeout', this.config.timeout)
    } else {
      throw new NetworkError('Network request failed', error as Error)
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private calculateRetryDelay(attempt: number): number {
    return this.config.retryDelay * Math.pow(2, attempt - 1)
  }

  async request<T>(config: AxiosRequestConfig): Promise<APIResponse<T>> {
    let lastError: Error

    for (let attempt = 1; attempt <= this.config.retries + 1; attempt++) {
      try {
        const response: AxiosResponse<APIResponse<T>> =
          await this.client.request(config)
        return response.data
      } catch (error: unknown) {
        lastError = error as Error

        if (
          attempt <= this.config.retries &&
          (error instanceof NetworkError ||
            error instanceof TimeoutError ||
            error instanceof ServerError)
        ) {
          const delay = this.calculateRetryDelay(attempt)
          await this.sleep(delay)
          continue
        }

        if (error instanceof RateLimitError && error.retryAfter) {
          if (attempt <= this.config.retries) {
            await this.sleep(error.retryAfter * 1000)
            continue
          }
        }

        throw error
      }
    }

    throw lastError!
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}
