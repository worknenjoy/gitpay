import { BalanceTransaction, Charge, Transfer } from './types'

export function amountUSDCentsFromCharge(charge: Charge): number {
  const bt: BalanceTransaction | undefined = charge?.balance_transaction
  if (bt && bt.currency && bt.currency.toLowerCase() === 'usd' && typeof bt.amount === 'number')
    return bt.amount
  if (charge?.currency?.toLowerCase() === 'usd' && typeof charge.amount === 'number')
    return charge.amount
  return 0
}

export function stripeFeeUSDCentsFromBT(bt: BalanceTransaction | null | undefined): number {
  if (bt && bt.currency && bt.currency.toLowerCase() === 'usd' && typeof bt.fee === 'number')
    return bt.fee
  return 0
}

export function transferUSDCents(transfer: Transfer | null | undefined): number {
  if (
    transfer &&
    transfer.currency &&
    transfer.currency.toLowerCase() === 'usd' &&
    typeof transfer.amount === 'number'
  )
    return transfer.amount
  return 0
}

export function getChargeUSDCents(charge: Charge | null | undefined): number {
  if (!charge) return 0
  const inv: any = charge.invoice
  if (
    inv &&
    typeof inv.amount_paid === 'number' &&
    inv.currency &&
    inv.currency.toLowerCase() === 'usd'
  )
    return inv.amount_paid
  return amountUSDCentsFromCharge(charge)
}

export function computeServiceType(charge?: Charge | null, transfer?: Transfer | null): string {
  const hasTG = Boolean(transfer?.transfer_group || charge?.transfer_group)
  const md = (charge?.metadata || {}) as Record<string, any>
  const inv = charge?.invoice as any | undefined
  const invMd = (inv?.metadata || {}) as Record<string, any>
  if (hasTG && (md.order_id || md.orderId)) return 'Bounty'
  if (md.payment_request_id || md.paymentRequestId) return 'PaymentRequest'
  if (inv && (invMd.wallet_order_id || invMd.walletOrderId)) return 'Wallet'
  return 'Consulting'
}

export function getTransactionTypeForCharge(charge: Charge): string {
  const inv: any = charge?.invoice
  if (inv?.id) return 'invoice'
  const subId: string | undefined = inv?.subscription || charge?.subscription
  if (subId) return 'subscription'
  if (charge?.payment_intent) return 'payment_intent'
  return 'charge'
}
