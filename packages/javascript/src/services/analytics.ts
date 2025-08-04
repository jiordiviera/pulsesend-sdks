import { HttpClient } from '../http-client'
import { AnalyticsOverview } from '../types'

export interface AnalyticsRequest {
  startDate?: Date | string
  endDate?: Date | string
  tags?: string[]
}

export class AnalyticsService {
  constructor(private httpClient: HttpClient) {}

  async overview(request: AnalyticsRequest = {}): Promise<AnalyticsOverview> {
    const params = new URLSearchParams()

    if (request.startDate) {
      const date = request.startDate instanceof Date ? request.startDate.toISOString() : request.startDate
      params.append('start_date', date)
    }
    if (request.endDate) {
      const date = request.endDate instanceof Date ? request.endDate.toISOString() : request.endDate
      params.append('end_date', date)
    }
    if (request.tags) {
      request.tags.forEach(tag => params.append('tags[]', tag))
    }

    const response = await this.httpClient.get<AnalyticsOverview>(
      `/analytics/overview?${params.toString()}`
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get analytics overview')
    }

    return response.data
  }

  async engagement(request: AnalyticsRequest = {}) {
    const params = new URLSearchParams()

    if (request.startDate) {
      const date = request.startDate instanceof Date ? request.startDate.toISOString() : request.startDate
      params.append('start_date', date)
    }
    if (request.endDate) {
      const date = request.endDate instanceof Date ? request.endDate.toISOString() : request.endDate
      params.append('end_date', date)
    }
    if (request.tags) {
      request.tags.forEach(tag => params.append('tags[]', tag))
    }

    const response = await this.httpClient.get(
      `/analytics/engagement?${params.toString()}`
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get engagement analytics')
    }

    return response.data
  }

  async reputation() {
    const response = await this.httpClient.get('/analytics/reputation')

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get reputation analytics')
    }

    return response.data
  }
}