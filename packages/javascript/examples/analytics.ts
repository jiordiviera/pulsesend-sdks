import { PulseSend } from '@pulsesend/javascript'

async function analyticsExample() {
  const client = new PulseSend('pk_test_your_api_key_here')

  try {
    // Get analytics overview
    const overview = await client.analytics.overview({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      tags: ['marketing']
    })

    console.log('Analytics Overview:')
    console.log('- Emails sent:', overview.emails.sent)
    console.log('- Emails delivered:', overview.emails.delivered)
    console.log('- Open rate:', `${(overview.engagement.openRate * 100).toFixed(2)}%`)
    console.log('- Click rate:', `${(overview.engagement.clickRate * 100).toFixed(2)}%`)
    console.log('- Reputation score:', overview.reputation.score)

    // List recent emails
    const recentEmails = await client.emails.list({
      limit: 10,
      status: 'delivered'
    })

    console.log(`\nRecent ${recentEmails.data.length} delivered emails:`)
    recentEmails.data.forEach(email => {
      console.log(`- ${email.subject} (to: ${email.to[0].email}) - ${email.opens} opens, ${email.clicks} clicks`)
    })

    // Get engagement analytics
    const engagement = await client.analytics.engagement()
    console.log('\nEngagement metrics:', engagement)

  } catch (error) {
    console.error('Failed to get analytics:', error.message)
  }
}

analyticsExample()