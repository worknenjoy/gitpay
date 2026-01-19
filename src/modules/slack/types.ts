/**
 * Type definitions for Slack notification module
 */

export interface Task {
  id?: number
  title?: string
  description?: string
  not_listed?: boolean
  private?: boolean
}

export interface User {
  id?: number
  username?: string
  name?: string
}

export interface OrderData {
  amount: number | string
  currency?: string
}

export interface SlackMessagePayload {
  username: string
  blocks: SlackBlock[]
  attachments?: SlackAttachment[]
}

export interface SlackBlock {
  type: string
  text?: {
    type: string
    text: string
  }
  elements?: Array<{
    type: string
    text: string
  }>
}

export interface SlackAttachment {
  color: string
  blocks: SlackBlock[]
}
