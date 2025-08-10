# @pulsesend/sdks

Official JavaScript/TypeScript SDK for the PulseSend API.

## Installation

```bash
npm install @pulsesend/sdks
# or
yarn add @pulsesend/sdks  
# or
bun add @pulsesend/sdks
```

## Quick Start

```typescript
import { PulseSend } from '@pulsesend/sdks'

const client = new PulseSend('pk_live_your_api_key_here')

// Send an email
await client.emails.send({
  to: ['user@example.com'],
  from: 'noreply@pulsesend.cm',
  subject: 'Bienvenue {{name}}!',
  html: '<h1>Salut {{name}}!</h1><p>Merci de rejoindre PulseSend Cameroun 🇨🇲</p>',
  variables: {
    name: 'Jean Mballa'
  },
  tags: ['onboarding', 'cameroun']
})
```

## Configuration

### Basic Configuration

```typescript
const client = new PulseSend('pk_live_your_api_key_here')
```

### Advanced Configuration

```typescript
const client = new PulseSend({
  apiKey: 'pk_live_your_api_key_here',
  baseUrl: 'https://api.pulsesend.com/v1', // Optional
  timeout: 10000, // Optional, default: 10s
  retries: 3, // Optional, default: 3
  retryDelay: 1000 // Optional, default: 1s
})
```

## API Reference

### Emails

#### Send Email

```typescript
const result = await client.emails.send({
  to: ['user@example.com'],
  from: 'sender@example.com',
  subject: 'Your Subject',
  html: '<p>Your HTML content</p>',
  // Optional fields
  text: 'Your plain text content',
  cc: ['cc@example.com'],
  bcc: ['bcc@example.com'],
  variables: { name: 'John' },
  tags: ['marketing'],
  metadata: { campaign: 'welcome' },
  sendAt: new Date('2024-01-01T10:00:00Z')
})
```

#### List Emails

```typescript
const emails = await client.emails.list({
  status: 'delivered',
  limit: 50,
  offset: 0,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31')
})
```

#### Get Email

```typescript
const email = await client.emails.get('email_id')
```

#### Cancel Email

```typescript
await client.emails.cancel('email_id')
```

### Analytics

#### Overview

```typescript
const analytics = await client.analytics.overview({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  tags: ['marketing']
})
```

#### Engagement

```typescript
const engagement = await client.analytics.engagement()
```

#### Reputation

```typescript
const reputation = await client.analytics.reputation()
```

## Error Handling

The SDK provides specific error classes for different scenarios:

```typescript
import { 
  InvalidApiKeyError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ServerError
} from '@pulsesend/sdks'

try {
  await client.emails.send(emailData)
} catch (error) {
  if (error instanceof QuotaExceededError) {
    console.log('Quota exceeded, upgrade your plan')
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited, retry after ${error.retryAfter} seconds`)
  } else if (error instanceof ValidationError) {
    console.log('Validation error:', error.details)
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import { SendEmailRequest, SendEmailResponse } from '@pulsesend/sdks'

const request: SendEmailRequest = {
  to: ['user@example.com'],
  from: 'sender@example.com',
  subject: 'Test',
  html: '<p>Test</p>'
}

const response: SendEmailResponse = await client.emails.send(request)
```

## Retry Logic

The SDK automatically retries failed requests with exponential backoff for:

- Network errors
- Timeout errors  
- Server errors (5xx)
- Rate limiting (with proper delay)

## Environment Variables

You can set your API key using environment variables:

```bash
export PULSESEND_API_KEY=pk_live_your_api_key_here
```

```typescript
const client = new PulseSend(process.env.PULSESEND_API_KEY!)
```

## Examples

See the [examples](./examples/) directory for more usage examples.

## License

MIT © [PulseSend](https://pulsesend.com)