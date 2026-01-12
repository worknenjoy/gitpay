const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')

const sendSlackMessage = async (payload) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || secrets.slack?.webhookUrl

  if (!webhookUrl) return false

  try {
    await requestPromise({
      method: 'POST',
      uri: webhookUrl,
      body: payload,
      json: true
    })
    return true
  } catch (error) {
    console.error('Slack notification failed:', error.message)
    return false
  }
}

const formatCurrency = (amount, currency = 'USD') => {
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return '$0.00'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(numAmount)
}

const notifyNewIssue = async (task, user) => {
  if (!task?.id) return false

  const username = user?.username || user?.name || 'Unknown'

  return await sendSlackMessage({
    username: 'Gitpay',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'New issue imported'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${task.title || 'Untitled Issue'}*`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: task.description || 'No description provided.'
        }
      }
    ],
    attachments: [
      {
        color: '#047651',
        blocks: [
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Imported by *${username}*`
              }
            ]
          }
        ]
      }
    ]
  })
}

const notifyNewBounty = async (task, order, user) => {
  if (!task?.id || !order?.amount) return false

  const username = user?.username || user?.name || 'Unknown'
  const amount = formatCurrency(order.amount, order.currency)

  return await sendSlackMessage({
    username: 'Gitpay',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'New bounty added'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${amount}*`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${task.title || 'Untitled Task'}*`
        }
      }
    ],
    attachments: [
      {
        color: '#047651',
        blocks: [
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Bounty set by *${username}*`
              }
            ]
          }
        ]
      }
    ]
  })
}

module.exports = {
  notifyNewIssue,
  notifyNewBounty
}
