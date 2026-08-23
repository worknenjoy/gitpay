import { Transaction } from 'sequelize'
import Models from '../../../models'

import { calculateAmountWithPercent } from '../../../utils'

import { findPaymentRequestByPaymentLinkId } from '../../../queries/payment-request/payment-request'
import {
  findPaymentRequestPayment,
  findPaymentRequestPaymentByPaymentRequestId
} from '../../../queries/payment-request/payment-request-payment'

import { getPaymentProvider } from '../../../providers'
import { executePaymentRequestTransfer } from '../../../services/paymentRequest/executePaymentRequestTransfer'
import { PaymentRequestTransferStatus } from '../../../services/paymentRequest/paymentRequestTransferStatuses'

const models = Models as any

type CheckoutSession = {
  payment_link: string | { id: string } | null
  payment_status: string
  amount_total: number
  payment_intent: string
  customer_details?: { name?: string; email?: string }
  /**
   * Whop platform net after processor fees (major currency units).
   * Used as the claim/transfer fee base. Not a Stripe field.
   */
  amount_after_fees?: number | null
  /**
   * Payment provider's own reported fee (major currency units), e.g. Whop's
   * application fee. Not a Stripe field.
   */
  provider_fee_amount?: number | null
}

/** Whop real charge id — preferred over provisional membership ids for disputes/refunds. */
function isWhopPaymentSource(source: string | null | undefined): boolean {
  return String(source || '').startsWith('pay_')
}

/**
 * Detect dual-event pairs for the same checkout:
 * membership.activated (mem_…) and payment.succeeded (pay_…) must not create two payments.
 * Still allows multi-pay PRs (two different pay_… sources).
 */
function isCrossEventDuplicateSource(
  existingSource: string | null | undefined,
  newSource: string | null | undefined
): boolean {
  const existing = String(existingSource || '')
  const incoming = String(newSource || '')
  if (!existing || !incoming || existing === incoming) return false

  const existingPay = isWhopPaymentSource(existing)
  const incomingPay = isWhopPaymentSource(incoming)
  const existingMem = existing.startsWith('mem_')
  const incomingMem = incoming.startsWith('mem_')

  // membership.activated (mem_…) ↔ payment.succeeded (pay_…)
  if ((existingMem && incomingPay) || (existingPay && incomingMem)) return true
  // Provisional non-pay source vs real Whop payment id
  if (incomingPay && !existingPay) return true
  return false
}

/**
 * Prefer upgrading stored source to the real Whop payment id (pay_…).
 * Refresh gross amount and amount_after_fees when payment.succeeded carries them.
 */
async function maybeUpgradePaymentSourceAndAmount(
  payment: any,
  paymentIntentId: string,
  session: CheckoutSession
): Promise<void> {
  const updates: Record<string, any> = {}

  if (isWhopPaymentSource(paymentIntentId) && !isWhopPaymentSource(payment.source)) {
    updates.source = paymentIntentId
  }

  // If a prior event stored a wrong net amount, prefer session gross when present
  if (session.amount_total != null && Number(session.amount_total) > 0) {
    const currency = payment.currency || payment.PaymentRequest?.currency || 'usd'
    const sessionDecimal = calculateAmountWithPercent(
      session.amount_total,
      0,
      'centavos',
      currency
    ).decimal
    if (
      sessionDecimal != null &&
      Number(payment.amount) !== Number(sessionDecimal) &&
      isWhopPaymentSource(paymentIntentId)
    ) {
      // Only correct amount when we have the real payment event (authoritative total)
      updates.amount = sessionDecimal
    }
  }

  // Whop payment.succeeded carries amount_after_fees; membership events usually do not
  if (
    session.amount_after_fees != null &&
    Number.isFinite(Number(session.amount_after_fees)) &&
    Number(session.amount_after_fees) >= 0
  ) {
    const net = Number(session.amount_after_fees)
    if (payment.amount_after_fees == null || Number(payment.amount_after_fees) !== net) {
      updates.amount_after_fees = net
    }
  }

  if (
    session.provider_fee_amount != null &&
    Number.isFinite(Number(session.provider_fee_amount)) &&
    Number(session.provider_fee_amount) >= 0
  ) {
    const fee = Number(session.provider_fee_amount)
    if (payment.provider_fee_amount == null || Number(payment.provider_fee_amount) !== fee) {
      updates.provider_fee_amount = fee
    }
  }

  if (Object.keys(updates).length > 0) {
    await payment.update(updates)
    await payment.reload({
      include: [
        { model: models.PaymentRequest },
        { model: models.User },
        { model: models.PaymentRequestCustomer }
      ]
    })
  }
}

/**
 * Resume transfer flow for an already-recorded payment (no payment-made re-email).
 */
async function resumeExistingPayment(existingPayment: any) {
  const existingStatus = existingPayment.transferStatus

  // Fully done — skip side effects
  if (existingStatus === PaymentRequestTransferStatus.INITIATED) {
    return {
      paymentRequest: existingPayment.PaymentRequest,
      paymentRequestPayment: existingPayment,
      user: existingPayment.User,
      currency: existingPayment.currency || existingPayment.PaymentRequest?.currency || 'usd',
      originalAmountDecimal: Number(existingPayment.amount),
      transferAmountDecimal: 0,
      resultingBalanceCents: 0,
      balanceTransactionForEmail: null,
      updatedBalanceTransactionForEmail: null,
      transferCreated: false,
      transferDeferred: false,
      alreadyProcessed: true
    }
  }

  // pending_funds or incomplete (null) — ensure PR is paid, then run transfer flow
  const existingPr = existingPayment.PaymentRequest
  if (existingPr && existingPr.status !== 'paid') {
    const deactivate = existingPr.deactivate_after_payment
    const paymentProvider = getPaymentProvider(existingPr.provider || undefined)
    if (deactivate && existingPr.payment_link_id) {
      await paymentProvider
        .updatePaymentRequestPaymentLinkActive(existingPr.payment_link_id, false)
        .catch(() => null)
    }
    await existingPr.update({
      status: 'paid',
      active: deactivate ? false : existingPr.active
    })
  }

  const transferResult = await executePaymentRequestTransfer({
    paymentRequestPaymentId: existingPayment.id
  })
  return {
    paymentRequest: transferResult.paymentRequest,
    paymentRequestPayment: transferResult.paymentRequestPayment,
    user: transferResult.user,
    currency: transferResult.currency,
    originalAmountDecimal: transferResult.originalAmountDecimal,
    transferAmountDecimal: transferResult.transferAmountDecimal,
    resultingBalanceCents: transferResult.resultingBalanceCents,
    balanceTransactionForEmail: transferResult.balanceTransactionForEmail,
    updatedBalanceTransactionForEmail: transferResult.updatedBalanceTransactionForEmail,
    transferCreated: transferResult.transferCreated,
    transferDeferred: transferResult.deferred,
    // Payment record already existed — do not re-send payment-made email
    alreadyProcessed: true
  }
}

/**
 * Record a payment-request payment from a checkout session, then run the transfer flow.
 *
 * Stripe: transfer is instant (source_transaction).
 * Whop: transfer is attempted immediately; if platform available balance is still
 * settling, payment is stored with transferStatus=pending_funds and the daily cron
 * completes the transfer later.
 */
export async function processCheckoutSessionCompleted(session: CheckoutSession) {
  const paymentLinkId =
    typeof session.payment_link === 'string' ? session.payment_link : session.payment_link?.id

  if (!paymentLinkId) {
    const err: any = new Error('Missing payment_link on session')
    err.statusCode = 400
    throw err
  }

  const paymentIntentId = session.payment_intent
  if (!paymentIntentId) {
    const err: any = new Error('Missing payment_intent on session')
    err.statusCode = 400
    throw err
  }

  // Idempotent: if payment already exists for this source, do not create a duplicate.
  // Still allow transfer retries when transfer was deferred or never finished.
  const existingBySource = await findPaymentRequestPayment(paymentIntentId)
  if (existingBySource) {
    return resumeExistingPayment(existingBySource)
  }

  const paymentRequest = await findPaymentRequestByPaymentLinkId(paymentLinkId)

  if (!paymentRequest) {
    const err: any = new Error('Payment request not found')
    err.statusCode = 404
    throw err
  }

  // Whop may send membership.activated (mem_…) and payment.succeeded (pay_…) for the
  // same checkout. Deduplicate so we only send payment-made once and keep one row.
  // Multi-pay PRs still work: a second distinct pay_… creates a new payment.
  const existingByPr = await findPaymentRequestPaymentByPaymentRequestId(paymentRequest.id)
  if (existingByPr) {
    const shouldDedupe =
      isCrossEventDuplicateSource(existingByPr.source, paymentIntentId) ||
      Boolean(paymentRequest.deactivate_after_payment)

    if (shouldDedupe) {
      await maybeUpgradePaymentSourceAndAmount(existingByPr, paymentIntentId, session)
      return resumeExistingPayment(existingByPr)
    }
  }

  const {
    amount,
    custom_amount,
    currency,
    deactivate_after_payment,
    User: user = {}
  } = paymentRequest

  const customerDetails = session.customer_details || {}

  const originalAmount = calculateAmountWithPercent(
    session.amount_total ?? 0,
    0,
    'centavos',
    currency
  )
  const amountAfterFee = custom_amount
    ? calculateAmountWithPercent(session.amount_total ?? 0, 8, 'centavos', currency)
    : calculateAmountWithPercent(amount, 8, 'decimal', currency)

  const transferAmountDecimal = amountAfterFee.decimal

  const paymentProvider = getPaymentProvider(paymentRequest.provider || undefined)

  let paymentLinkActiveChanged = false

  try {
    if (deactivate_after_payment) {
      await paymentProvider.updatePaymentRequestPaymentLinkActive(paymentLinkId, false)
      paymentLinkActiveChanged = true
    }

    // Phase 1: always persist payment (independent of transfer success)
    const { paymentRequestUpdated, paymentRequestPayment } = await models.sequelize.transaction(
      async (tx: Transaction) => {
        const paymentRequestUpdated = await paymentRequest.update(
          {
            status: 'paid',
            active: deactivate_after_payment ? false : true
          },
          { transaction: tx }
        )

        if (!paymentRequestUpdated) {
          throw new Error('Failed to update payment request')
        }

        const customer = await models.PaymentRequestCustomer.create(
          {
            name: customerDetails.name,
            email: customerDetails.email,
            userId: paymentRequest.userId,
            sourceId: 'gcc_' + Math.random().toString(36).substring(2, 15)
          },
          { transaction: tx }
        )

        const netAfterFees =
          session.amount_after_fees != null &&
          Number.isFinite(Number(session.amount_after_fees)) &&
          Number(session.amount_after_fees) >= 0
            ? Number(session.amount_after_fees)
            : null

        const providerFeeAmount =
          session.provider_fee_amount != null &&
          Number.isFinite(Number(session.provider_fee_amount)) &&
          Number(session.provider_fee_amount) >= 0
            ? Number(session.provider_fee_amount)
            : null

        const paymentRequestPayment = await models.PaymentRequestPayment.create(
          {
            paymentRequestId: paymentRequest.id,
            userId: paymentRequest.userId,
            amount: originalAmount.decimal,
            amount_after_fees: netAfterFees,
            provider_fee_amount: providerFeeAmount,
            currency,
            source: paymentIntentId,
            status: session.payment_status,
            customerId: customer.id,
            transferStatus: null
          },
          { transaction: tx }
        )

        await paymentRequestPayment.reload({
          transaction: tx,
          include: [
            { model: models.PaymentRequest },
            { model: models.User },
            { model: models.PaymentRequestCustomer }
          ]
        })

        return { paymentRequestUpdated, paymentRequestPayment }
      }
    )

    // Phase 2: transfer flow (Stripe instant; Whop may defer to pending_funds + pending claim)
    // Payment is already committed — transfer failures must not lose the payment record.
    try {
      const transferResult = await executePaymentRequestTransfer({
        paymentRequestPaymentId: paymentRequestPayment.id
      })

      return {
        paymentRequest: transferResult.paymentRequest || paymentRequestUpdated,
        paymentRequestPayment: transferResult.paymentRequestPayment || paymentRequestPayment,
        user: transferResult.user || user,
        currency: transferResult.currency || currency,
        originalAmountDecimal: transferResult.originalAmountDecimal || originalAmount.decimal,
        transferAmountDecimal: transferResult.transferAmountDecimal || transferAmountDecimal,
        resultingBalanceCents: transferResult.resultingBalanceCents,
        balanceTransactionForEmail: transferResult.balanceTransactionForEmail,
        updatedBalanceTransactionForEmail: transferResult.updatedBalanceTransactionForEmail,
        transferCreated: transferResult.transferCreated,
        transferDeferred: transferResult.deferred
      }
    } catch (transferError: any) {
      // Payment is saved; rethrow for Stripe. For Whop, executePaymentRequestTransfer
      // should already have deferred — if something still throws, surface it.
      console.error('[processCheckoutSessionCompleted] transfer failed after payment saved', {
        paymentRequestPaymentId: paymentRequestPayment.id,
        provider: paymentProvider.name,
        error: transferError?.message || transferError
      })
      throw transferError
    }
  } catch (error) {
    if (paymentLinkActiveChanged) {
      await paymentProvider
        .updatePaymentRequestPaymentLinkActive(paymentLinkId, true)
        .catch(() => null)
    }

    throw error
  }
}
