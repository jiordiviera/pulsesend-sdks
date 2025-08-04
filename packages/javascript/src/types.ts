export interface PulseSendConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
  disposition?: 'attachment' | 'inline'
  cid?: string
}

export interface SendEmailRequest {
  to: (string | EmailRecipient)[]
  from: string | EmailRecipient
  cc?: (string | EmailRecipient)[]
  bcc?: (string | EmailRecipient)[]
  subject: string
  text?: string
  html?: string
  templateId?: string
  variables?: Record<string, unknown>
  attachments?: EmailAttachment[]
  tags?: string[]
  metadata?: Record<string, unknown>
  headers?: Record<string, string>
  sendAt?: Date | string
}

export interface SendEmailResponse {
  id: string
  messageId: string
  status: 'queued' | 'sent' | 'delivered' | 'failed'
  createdAt: string
  scheduledAt?: string
}

export interface ListEmailsRequest {
  status?: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'complained'
  to?: string
  from?: string
  subject?: string
  tags?: string[]
  limit?: number
  offset?: number
  startDate?: Date | string
  endDate?: Date | string
}

export interface EmailLog {
  id: string
  messageId: string
  to: EmailRecipient[]
  from: EmailRecipient
  subject: string
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'complained'
  tags: string[]
  metadata: Record<string, unknown>
  createdAt: string
  sentAt?: string
  deliveredAt?: string
  failedAt?: string
  error?: string
  opens: number
  clicks: number
}

export interface ListEmailsResponse {
  data: EmailLog[]
  pagination: {
    total: number
    count: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

export interface AnalyticsOverview {
  period: {
    start: string
    end: string
  }
  emails: {
    sent: number
    delivered: number
    failed: number
    bounced: number
    complained: number
  }
  engagement: {
    opens: number
    clicks: number
    openRate: number
    clickRate: number
  }
  reputation: {
    score: number
    status: 'excellent' | 'good' | 'fair' | 'poor'
  }
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: APIError
  requestId: string
}