import { Transaction } from 'sequelize'
import Models from '../../../models'

import { calculateAmountWithPercent } from '../../../utils'

import { findPaymentRequestByPaymentLinkId } from '../../../queries/payment-request/payment-request'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'

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
  const existingPayment = await findPaymentRequestPayment(paymentIntentId)
  if (existingPayment) {
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

  const paymentRequest = await findPaymentRequestByPaymentLinkId(paymentLinkId)

  if (!paymentRequest) {
    const err: any = new Error('Payment request not found')
    err.statusCode = 404
    throw err
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

        const paymentRequestPayment = await models.PaymentRequestPayment.create(
          {
            paymentRequestId: paymentRequest.id,
            userId: paymentRequest.userId,
            amount: originalAmount.decimal,
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
      console.error(
        '[processCheckoutSessionCompleted] transfer failed after payment saved',
        {
          paymentRequestPaymentId: paymentRequestPayment.id,
          provider: paymentProvider.name,
          error: transferError?.message || transferError
        }
      )
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
