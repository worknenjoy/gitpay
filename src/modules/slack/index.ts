/**
 * Slack notification module
 * Handles sending notifications to Slack channel for new issues and bounties
 */

import * as requestPromise from 'request-promise'
import secrets from '../../config/secrets'
import type { Task, User, OrderData, SlackMessagePayload } from './types'

const sendSlackMessage = async (payload: SlackMessagePayload): Promise<boolean> => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || secrets.slack?.webhookUrl

  if (!webhookUrl) {
    return false
  }

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

const formatCurrency = (amount: number | string, currency: string = 'USD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(numAmount)
}

/**
 * Sends a Slack notification when a new issue is imported
 * @param task - The task/issue that was imported
 * @param user - The user who imported the issue
 * @returns Promise<boolean> - True if notification was sent successfully
 */
export const notifyNewIssue = async (
  task: Task | null | undefined,
  user: User | null | undefined
): Promise<boolean> => {
  if (!task?.id) {
    return false
  }

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

/**
 * Sends a Slack notification when a new bounty payment is completed
 * @param task - The task/bounty that received payment
 * @param order - The order data containing amount and currency
 * @param user - The user who made the payment
 * @returns Promise<boolean> - True if notification was sent successfully
 */
export const notifyNewBounty = async (
  task: Task | null | undefined,
  order: OrderData | null | undefined,
  user: User | null | undefined
): Promise<boolean> => {
  if (!task?.id || !order?.amount) {
    return false
  }

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
