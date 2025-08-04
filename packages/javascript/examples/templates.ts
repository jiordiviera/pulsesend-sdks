import { PulseSend } from '@pulsesend/javascript'

async function templatesExample() {
  const client = new PulseSend('pk_test_your_api_key_here')

  try {
    // Send email with template variables
    const result = await client.emails.send({
      to: [{ email: 'user@example.com', name: 'John Doe' }],
      from: { email: 'noreply@yoursite.com', name: 'Your Company' },
      subject: 'Welcome {{firstName}}!',
      html: `
        <h1>Hello {{firstName}} {{lastName}}!</h1>
        <p>Welcome to {{companyName}}.</p>
        <p>Your account details:</p>
        <ul>
          <li>Email: {{email}}</li>
          <li>Plan: {{plan}}</li>
          <li>Created: {{createdAt}}</li>
        </ul>
        <p>Best regards,<br>The {{companyName}} Team</p>
      `,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        companyName: 'Your Company',
        plan: 'Premium',
        createdAt: new Date().toLocaleDateString()
      },
      tags: ['welcome', 'onboarding'],
      metadata: {
        userId: '12345',
        source: 'signup'
      }
    })

    console.log('Template email sent:', result.id)
  } catch (error) {
    console.error('Failed to send template email:', error.message)
  }
}

templatesExample()