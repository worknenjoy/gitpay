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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Slack notification failed:', errorMessage)
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

/**
 * Helper function to check if a task should trigger Slack notifications
 * @param task - The task object (can be Sequelize model instance or plain object)
 * @returns boolean - True if task is public and should notify
 */
const shouldNotifyForTask = (task) => {
  if (!task) return false

  // Handle both Sequelize model instances and plain objects
  const taskData = task.dataValues || task
  return !(taskData.not_listed === true || taskData.private === true)
}

/**
 * Helper function to safely send bounty notification with proper error handling
 * @param task - The task object
 * @param orderData - Order data with amount and currency
 * @param user - The user object
 * @param context - Optional context string for error logging (e.g., 'wallet payment', 'PayPal payment')
 * @returns Promise<boolean> - True if notification was sent successfully
 */
const notifyBountyWithErrorHandling = async (task, orderData, user, context = 'payment') => {
  // Check if task and user exist
  if (!task || !user) {
    return false
  }

  // Check privacy settings
  if (!shouldNotifyForTask(task)) {
    return false
  }

  // Extract data values if Sequelize model instances
  const taskData = task.dataValues || task
  const userData = user.dataValues || user

  // Prepare order data
  const order = {
    amount: orderData.amount,
    currency: orderData.currency || 'USD'
  }

  try {
    await notifyNewBounty(taskData, order, userData)
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error sending Slack notification for new bounty (${context}):`, errorMessage)
    return false
  }
}

module.exports = {
  notifyNewIssue,
  notifyNewBounty,
  shouldNotifyForTask,
  notifyBountyWithErrorHandling
}
