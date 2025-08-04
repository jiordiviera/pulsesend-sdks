import { PulseSend } from '@pulsesend/javascript'

async function basicExample() {
  const client = new PulseSend('pk_test_your_api_key_here')

  try {
    // Send a simple email
    const result = await client.emails.send({
      to: ['user@example.com'],
      from: 'noreply@yoursite.com',
      subject: 'Welcome to PulseSend!',
      html: `
        <h1>Welcome!</h1>
        <p>Thank you for signing up for our service.</p>
        <p>Best regards,<br>The PulseSend Team</p>
      `
    })

    console.log('Email sent successfully:', result.id)
    console.log('Status:', result.status)
  } catch (error) {
    console.error('Failed to send email:', error.message)
  }
}

basicExample()