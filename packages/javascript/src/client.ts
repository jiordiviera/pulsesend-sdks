import { HttpClient } from './http-client'
import { EmailsService } from './services/emails'
import { AnalyticsService } from './services/analytics'
import { PulseSendConfig } from './types'

export class PulseSend {
  private httpClient: HttpClient

  public readonly emails: EmailsService
  public readonly analytics: AnalyticsService

  constructor(apiKeyOrConfig: string | PulseSendConfig) {
    const config: PulseSendConfig =
      typeof apiKeyOrConfig === 'string'
        ? { apiKey: apiKeyOrConfig }
        : apiKeyOrConfig

    if (!config.apiKey) {
      throw new Error('API key is required')
    }

    if (!config.apiKey.startsWith('pk_')) {
      throw new Error('Invalid API key format. API key should start with "pk_"')
    }

    this.httpClient = new HttpClient(config)
    this.emails = new EmailsService(this.httpClient)
    this.analytics = new AnalyticsService(this.httpClient)
  }

  async ping(): Promise<{ status: string; timestamp: string }> {
    const response = await this.httpClient.get<{
      status: string
      timestamp: string
    }>('/ping')

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to ping API')
    }

    return response.data
  }

  static get version(): string {
    return '0.1.0'
  }
}
