import Models from '../../../models'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import PaymentRequestMail from '../../../mail/paymentRequest'
import { calculateAmountWithPercent } from '../../../utils'
import { sellerClawbackCentsForRefund } from '../../paymentRequest/sellerNetAmount'
import { PaymentRequestTransferStatus } from '../../paymentRequest/paymentRequestTransferStatuses'

const models = Models as any

export type RefundDebitParams = {
  /** The refund's own id (Stripe re_xxx / Whop refund id) — idempotency key */
  refund_id: string
  /** Underlying payment id (Stripe payment_intent id / Whop payment.id) */
  source_id: string
  /** Amount actually refunded, in cents */
  refunded_amount: number
  closedAt?: Date
}

/**
 * Debit PR balance for a refund (cents), when there's actually something to claw back.
 *
 * Transfer-status-aware:
 * - If the seller already received the money (transfer INITIATED), the full seller-net
 *   portion of the refunded amount is clawed back (not just Gitpay's 8%) — platform
 *   policy is that the seller keeps nothing for a refunded service, regardless of who
 *   initiated the refund (Gitpay's own partial-refund action, an external dashboard
 *   refund, or a Whop auto-refund). See sellerClawbackCentsForRefund for how gross vs.
 *   already-net reported amounts are reconciled.
 * - If the seller was never paid (transfer not yet INITIATED — still settling, or
 *   already blocked by the payment_refunded guard in executePaymentRequestTransfer.ts),
 *   there's nothing of theirs to claw back, but the platform can still have a real,
 *   unrecoverable loss: Whop/Stripe don't return their own processing fee on a refund,
 *   so if refunded_amount exceeds amount_after_fees (the real net the platform actually
 *   received at payment time), that excess is a cost this seller's transaction caused
 *   and is debited from them — even though they were never paid.
 *
 * When there's no balance impact at all (nothing to claw back, or amount_after_fees is
 * unknown so the loss can't be quantified), no PaymentRequestBalanceTransaction is
 * created — instead a simple "this payment was refunded" notice goes to the seller.
 * The customer always gets a refund confirmation, regardless of any balance impact.
 *
 * Idempotent per refund_id (a payment can have multiple distinct refunds, so the
 * refund's own id is the dedupe key — not the payment id).
 * No-op if source_id doesn't resolve to a PaymentRequestPayment (bounty orders, etc).
 */
export const debitRefundForPaymentRequest = async ({
  refund_id,
  source_id,
  refunded_amount,
  closedAt
}: RefundDebitParams) => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
  if (!paymentRequestPayment) {
    console.log(`[refund] not a payment-request payment, skipping balance debit: ${source_id}`)
    return {}
  }

  const paymentRequestUser = paymentRequestPayment.User
  const paymentRequest = paymentRequestPayment.PaymentRequest
  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  const existingDebit = await models.PaymentRequestBalanceTransaction.findOne({
    where: {
      sourceId: refund_id,
      reason: 'REFUND',
      type: 'DEBIT'
    }
  })
  if (existingDebit) {
    console.log(
      `Skipping duplicate REFUND DEBIT for refund ${refund_id} (existing tx ${existingDebit.id})`
    )
    return existingDebit
  }

  const currency = paymentRequest?.currency || paymentRequestPayment.currency || 'usd'
  // Direct charge: funds settled directly on the seller's connected Whop company —
  // executePaymentRequestTransfer marks these transferStatus=INITIATED too (nothing
  // left for Gitpay to do), but unlike the legacy path Gitpay never transferred
  // anything to the seller here, so there is nothing of Gitpay's to claw back. The
  // refund is paid out of the seller's own connected-company balance directly, and
  // Whop reduces its share of the application fee on its own — no local ledger entry
  // reflects a real Gitpay liability for this payment.
  const isDirectCharge = Boolean(paymentRequestPayment.destination_account_id)
  const wasTransferred =
    !isDirectCharge &&
    paymentRequestPayment.transferStatus === PaymentRequestTransferStatus.INITIATED

  let clawbackAmount = 0
  let reasonDetails: string

  if (isDirectCharge) {
    reasonDetails = 'refund_direct_charge_no_platform_transfer'
  } else if (wasTransferred) {
    reasonDetails = 'refund_payment_request_requested_by_customer'
    clawbackAmount = paymentRequest
      ? sellerClawbackCentsForRefund(refunded_amount, {
          paymentRequestPayment,
          paymentRequest,
          currency
        })
      : refunded_amount
  } else {
    reasonDetails = 'refund_before_transfer_processor_fee_not_returned'
    const netAmount = paymentRequestPayment.amount_after_fees
    if (netAmount != null && Number.isFinite(Number(netAmount))) {
      const netAmountCents = calculateAmountWithPercent(
        Number(netAmount),
        0,
        'decimal',
        currency
      ).centavos
      clawbackAmount = Math.max(0, refunded_amount - netAmountCents)
    }
    // else: amount_after_fees unknown — can't quantify a loss, clawbackAmount stays 0.
  }

  const refundedAmountDecimal = calculateAmountWithPercent(
    refunded_amount,
    0,
    'centavos',
    currency
  ).decimal

  if (clawbackAmount <= 0) {
    PaymentRequestMail.newRefundForPaymentRequest(
      paymentRequestUser,
      paymentRequestPayment,
      refundedAmountDecimal,
      currency
    ).catch((mailError: any) => {
      console.error(`Failed to send refund notice for Refund ID: ${refund_id}`, mailError)
    })
    PaymentRequestMail.refundConfirmationForCustomer(
      paymentRequestPayment,
      refundedAmountDecimal,
      currency
    ).catch((mailError: any) => {
      console.error(
        `Failed to send customer refund confirmation for Refund ID: ${refund_id}`,
        mailError
      )
    })
    return {}
  }

  const paymentRequestBalanceTransactionForRefund =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: refund_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: -clawbackAmount,
      type: 'DEBIT',
      reason: 'REFUND',
      reason_details: reasonDetails,
      status: 'completed',
      openedAt: closedAt || new Date(),
      closedAt: closedAt || new Date()
    })

  const balanceTransactionUpdated = await models.PaymentRequestBalanceTransaction.findOne({
    where: { id: paymentRequestBalanceTransactionForRefund.id },
    include: [{ model: models.PaymentRequestBalance }]
  })

  PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    paymentRequestUser,
    paymentRequestPayment,
    balanceTransactionUpdated
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Refund ID: ${refund_id}`, mailError)
  })

  PaymentRequestMail.refundConfirmationForCustomer(
    paymentRequestPayment,
    refundedAmountDecimal,
    currency
  ).catch((mailError: any) => {
    console.error(
      `Failed to send customer refund confirmation for Refund ID: ${refund_id}`,
      mailError
    )
  })

  return paymentRequestBalanceTransactionForRefund
}
