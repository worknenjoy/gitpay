const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')
const constants = require('../mail/constants')

const sendSlackMessage = async (payload) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || secrets.slack?.webhookUrl

  if (!webhookUrl) return

  try {
    await requestPromise({
      method: 'POST',
      uri: webhookUrl,
      body: payload,
      json: true
    })
  } catch (error) {
    console.error('Slack notification failed:', error.message)
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

const getTaskUrl = (taskId) => {
  return constants.taskUrl?.(taskId) || `https://gitpay.me/#/task/${taskId}`
}

const notifyNewIssue = async (task, user) => {
  if (!task?.id) return

  await sendSlackMessage({
    username: 'Gitpay BOT',
    icon_emoji: ':robot_face:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:label: *New issue imported*\n\n*${task.title || 'Untitled Issue'}*\n\n${task.description || 'No description provided.'}`
        }
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `Imported by *${user?.username || user?.name || 'Unknown'}*`
        }]
      }
    ]
  })
}

const notifyNewBounty = async (task, order, user) => {
  if (!task?.id || !order?.amount) return

  await sendSlackMessage({
    username: 'Gitpay BOT',
    icon_emoji: ':robot_face:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:moneybag: *New bounty added*\n\n*${formatCurrency(order.amount, order.currency)}*\n\n*${task.title || 'Untitled Task'}*`
        }
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `Bounty set by *${user?.username || user?.name || 'Unknown'}*`
        }]
      }
    ]
  })
}

module.exports = {
  notifyNewIssue,
  notifyNewBounty
}

