export type DisputeDataCreated = {
  source_id: string
  dispute: any
}

export type DisputeDataWithdrawn = {
  source_id: string
  dispute_id: string
  /** Dispute amount in cents */
  amount: number
  /** Provider dispute fee in cents (Stripe balance_tx fee or Whop $15) */
  fee: number
  reason: string
  status: string
  closedAt?: Date
  /**
   * Optional opened timestamp (ISO string, Date, or unix seconds).
   * When set, skips Stripe dispute retrieve (required for Whop).
   */
  openedAt?: number | Date | string
}

export type DisputeDataClosed = {
  source_id: string
  status: string
  dispute: any
}
