import { HttpClient } from '../http-client'
import {
  SendEmailRequest,
  SendEmailResponse,
  ListEmailsRequest,
  ListEmailsResponse,
  EmailRecipient
} from '../types'

export class EmailsService {
  constructor(private httpClient: HttpClient) {}

  private normalizeRecipient(recipient: string | EmailRecipient): EmailRecipient {
    if (typeof recipient === 'string') {
      return { email: recipient }
    }
    return recipient
  }

  private normalizeRecipients(recipients: (string | EmailRecipient)[]): EmailRecipient[] {
    return recipients.map(recipient => this.normalizeRecipient(recipient))
  }

  async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    const normalizedRequest = {
      ...request,
      to: this.normalizeRecipients(request.to),
      from: this.normalizeRecipient(request.from),
      cc: request.cc ? this.normalizeRecipients(request.cc) : undefined,
      bcc: request.bcc ? this.normalizeRecipients(request.bcc) : undefined,
      sendAt: request.sendAt instanceof Date ? request.sendAt.toISOString() : request.sendAt
    }

    const response = await this.httpClient.post<SendEmailResponse>(
      '/emails',
      normalizedRequest
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to send email')
    }

    return response.data
  }

  async list(request: ListEmailsRequest = {}): Promise<ListEmailsResponse> {
    const params = new URLSearchParams()

    if (request.status) params.append('status', request.status)
    if (request.to) params.append('to', request.to)
    if (request.from) params.append('from', request.from)
    if (request.subject) params.append('subject', request.subject)
    if (request.tags) request.tags.forEach(tag => params.append('tags[]', tag))
    if (request.limit) params.append('limit', request.limit.toString())
    if (request.offset) params.append('offset', request.offset.toString())
    if (request.startDate) {
      const date = request.startDate instanceof Date ? request.startDate.toISOString() : request.startDate
      params.append('start_date', date)
    }
    if (request.endDate) {
      const date = request.endDate instanceof Date ? request.endDate.toISOString() : request.endDate
      params.append('end_date', date)
    }

    const response = await this.httpClient.get<ListEmailsResponse>(
      `/emails?${params.toString()}`
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to list emails')
    }

    return response.data
  }

  async get(id: string) {
    const response = await this.httpClient.get(`/emails/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get email')
    }

    return response.data
  }

  async cancel(id: string): Promise<void> {
    const response = await this.httpClient.delete(`/emails/${id}`)

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to cancel email')
    }
  }
}