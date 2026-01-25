export type Issue = {
  id: number
  title: string
  description: string
  url: string
  status: IssueStatus
  TransferId: number | null
  transfer_id: number | null
  paid: boolean
  value: number
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
}

export type IssueStatus = 'open' | 'closed' | 'in_progress'
