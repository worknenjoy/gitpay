export type DisputeDataCreated = {
  source_id: string
  dispute: any
}

export type DisputeDataWithdrawn = {
  source_id: string
  dispute_id: string
  amount: number
  fee: number
  reason: string
  status: string
  closedAt: Date
}

export type DisputeDataClosed = {
  source_id: string
  status: string
  dispute: any
}
