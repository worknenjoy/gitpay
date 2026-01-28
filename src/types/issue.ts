export type Issue = {
  id: number
  title: string
  description: string
  url: string
  status: IssueStatus
  TransferId?: number | null
  transfer_id?: number | null
  Transfer?: Transfer
  paid: boolean
  value: number
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
}

export type Transfer = {
  id: number
  status: string
  value: string
  transfer_id: number | null
  transfer_method: string
  paypal_payout_id: string | null
  paypal_transfer_amount: string
  stripe_transfer_amount: string
  taskId: number
  userId: number
  to: number
  createdAt: Date
  updatedAt: Date
}

export type IssueStatus = 'open' | 'closed' | 'in_progress'
