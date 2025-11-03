export type Charge = any
export type Transfer = any
export type BalanceTransaction = any

export type ReportRow = {
  Status: string
  TransactionType: string
  TransferId: string
  ChargeId: string
  ServiceType: string
  'Transfer Amount': string
  'Original Charge Amount': string
  'Stripe Fee': string
  'Transfer Date': string
  'Charge Date': string
  Revenue: string
}

export type BuildTotals = {
  transferTotal: number
  chargeTotal: number
  fee: number
  revenue: number
}
