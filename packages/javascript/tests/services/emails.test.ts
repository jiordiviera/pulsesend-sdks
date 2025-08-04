import { EmailsService } from '../../src/services/emails'
import { HttpClient } from '../../src/http-client'
import { SendEmailRequest, SendEmailResponse, ListEmailsResponse } from '../../src/types'

jest.mock('../../src/http-client')

describe('EmailsService', () => {
  let emailsService: EmailsService
  let mockHttpClient: jest.Mocked<HttpClient>

  beforeEach(() => {
    mockHttpClient = new HttpClient({ apiKey: 'pk_test_123' }) as jest.Mocked<HttpClient>
    emailsService = new EmailsService(mockHttpClient)
  })

  describe('send', () => {
    it('should send email with string recipients', async () => {
      const request: SendEmailRequest = {
        to: ['user@example.com'],
        from: 'sender@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>'
      }

      const mockResponse = {
        success: true,
        data: {
          id: 'email_123',
          messageId: 'msg_123',
          status: 'queued' as const,
          createdAt: '2023-01-01T00:00:00Z'
        },
        requestId: 'req_123'
      }

      mockHttpClient.post.mockResolvedValue(mockResponse)

      const result = await emailsService.send(request)

      expect(result).toEqual(mockResponse.data)
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        ...request,
        to: [{ email: 'user@example.com' }],
        from: { email: 'sender@example.com' }
      })
    })

    it('should send email with recipient objects', async () => {
      const request: SendEmailRequest = {
        to: [{ email: 'user@example.com', name: 'John Doe' }],
        from: { email: 'sender@example.com', name: 'Sender' },
        subject: 'Test Email',
        html: '<p>Hello {{name}}</p>',
        variables: { name: 'John' }
      }

      const mockResponse = {
        success: true,
        data: {
          id: 'email_123',
          messageId: 'msg_123',
          status: 'queued' as const,
          createdAt: '2023-01-01T00:00:00Z'
        },
        requestId: 'req_123'
      }

      mockHttpClient.post.mockResolvedValue(mockResponse)

      const result = await emailsService.send(request)

      expect(result).toEqual(mockResponse.data)
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', request)
    })

    it('should handle Date sendAt', async () => {
      const sendAt = new Date('2023-12-01T10:00:00Z')
      const request: SendEmailRequest = {
        to: ['user@example.com'],
        from: 'sender@example.com',
        subject: 'Scheduled Email',
        html: '<p>Hello</p>',
        sendAt
      }

      const mockResponse = {
        success: true,
        data: {
          id: 'email_123',
          messageId: 'msg_123',
          status: 'queued' as const,
          createdAt: '2023-01-01T00:00:00Z',
          scheduledAt: '2023-12-01T10:00:00Z'
        },
        requestId: 'req_123'
      }

      mockHttpClient.post.mockResolvedValue(mockResponse)

      await emailsService.send(request)

      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        ...request,
        to: [{ email: 'user@example.com' }],
        from: { email: 'sender@example.com' },
        sendAt: '2023-12-01T10:00:00.000Z'
      })
    })

    it('should throw error on failed request', async () => {
      const request: SendEmailRequest = {
        to: ['user@example.com'],
        from: 'sender@example.com',
        subject: 'Test Email',
        html: '<p>Hello</p>'
      }

      const mockResponse = {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid email format' },
        requestId: 'req_123'
      }

      mockHttpClient.post.mockResolvedValue(mockResponse)

      await expect(emailsService.send(request)).rejects.toThrow('Invalid email format')
    })
  })

  describe('list', () => {
    it('should list emails with default parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          data: [],
          pagination: {
            total: 0,
            count: 0,
            offset: 0,
            limit: 50,
            hasMore: false
          }
        },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await emailsService.list()

      expect(result).toEqual(mockResponse.data)
      expect(mockHttpClient.get).toHaveBeenCalledWith('/emails?')
    })

    it('should list emails with filters', async () => {
      const request = {
        status: 'delivered' as const,
        to: 'user@example.com',
        tags: ['marketing', 'newsletter'],
        limit: 10,
        offset: 20,
        startDate: new Date('2023-01-01'),
        endDate: '2023-12-31'
      }

      const mockResponse = {
        success: true,
        data: {
          data: [],
          pagination: {
            total: 0,
            count: 0,
            offset: 20,
            limit: 10,
            hasMore: false
          }
        },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      await emailsService.list(request)

      const expectedUrl = '/emails?status=delivered&to=user%40example.com&tags%5B%5D=marketing&tags%5B%5D=newsletter&limit=10&offset=20&start_date=2023-01-01T00%3A00%3A00.000Z&end_date=2023-12-31'
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('get', () => {
    it('should get email by id', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'email_123', subject: 'Test Email' },
        requestId: 'req_123'
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await emailsService.get('email_123')

      expect(result).toEqual(mockResponse.data)
      expect(mockHttpClient.get).toHaveBeenCalledWith('/emails/email_123')
    })
  })

  describe('cancel', () => {
    it('should cancel email', async () => {
      const mockResponse = {
        success: true,
        requestId: 'req_123'
      }

      mockHttpClient.delete.mockResolvedValue(mockResponse)

      await emailsService.cancel('email_123')

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/emails/email_123')
    })

    it('should throw error on failed cancel', async () => {
      const mockResponse = {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Email not found' },
        requestId: 'req_123'
      }

      mockHttpClient.delete.mockResolvedValue(mockResponse)

      await expect(emailsService.cancel('email_123')).rejects.toThrow('Email not found')
    })
  })
})