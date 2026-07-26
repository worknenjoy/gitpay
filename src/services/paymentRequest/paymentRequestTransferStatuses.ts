/**
 * Status values for payment-request payout lifecycle.
 *
 * PaymentRequest.transfer_status and PaymentRequestPayment.transferStatus share these meanings.
 */
export const PaymentRequestTransferStatus = {
  /** Payment request created; customer has not paid yet */
  PENDING_PAYMENT: 'pending_payment',
  /**
   * Payment recorded, but platform available balance is not ready (Whop settlement).
   * Daily cron retries until funds are available, then initiates the transfer.
   */
  PENDING_FUNDS: 'pending_funds',
  /** Provider transfer created */
  INITIATED: 'initiated'
} as const

export type PaymentRequestTransferStatusValue =
  (typeof PaymentRequestTransferStatus)[keyof typeof PaymentRequestTransferStatus]
