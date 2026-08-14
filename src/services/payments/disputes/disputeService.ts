import Stripe from '../../../client/payment/stripe'
import Models from '../../../models'
import { DisputeDataCreated, DisputeDataWithdrawn, DisputeDataClosed } from './types'
import PaymentRequestMail from '../../../mail/paymentRequest'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { calculateAmountWithPercent } from '../../../utils'

const stripe = Stripe()
const models = Models as any

type DisputeResponse = any

function resolveOpenedAt(openedAt?: number | Date | string): number | Date {
  if (openedAt instanceof Date) return openedAt
  if (typeof openedAt === 'number' && Number.isFinite(openedAt)) return openedAt
  if (typeof openedAt === 'string' && openedAt) {
    const d = new Date(openedAt)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

function resolveClosedAtFromCreated(created: number | string | Date | undefined): Date {
  if (created instanceof Date) return created
  if (typeof created === 'number' && Number.isFinite(created)) {
    // Stripe uses unix seconds; values < year 3000 in ms would be huge — treat < 1e12 as seconds
    return new Date(created < 1e12 ? created * 1000 : created)
  }
  if (typeof created === 'string' && created) {
    const d = new Date(created)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

export const createDisputeForPaymentRequest = async ({
  source_id,
  dispute
}: DisputeDataCreated): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
  if (!paymentRequestPayment) {
    console.error(`Payment Request Payment not found for source ID: ${source_id}`)
    return {}
  }
  const paymentRequestUser = paymentRequestPayment.User

  PaymentRequestMail.newDisputeCreatedForPaymentRequest(
    paymentRequestUser,
    dispute,
    paymentRequestPayment
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Dispute ID: ${source_id}`, mailError)
  })

  return {}
}

/**
 * Debit PR balance for a dispute (amounts in cents).
 * finalDebit = amount + 8% gitpay fee + provider fee.
 * Idempotent: skips if a DISPUTE DEBIT already exists for this sourceId.
 */
export const withDrawnDisputeForPaymentRequest = async ({
  source_id,
  dispute_id,
  amount,
  fee,
  reason,
  status,
  closedAt,
  openedAt
}: DisputeDataWithdrawn): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)

  if (!paymentRequestPayment) {
    console.error(`Payment Request Payment not found for source ID: ${source_id}`)
    const err: any = new Error(`Payment Request Payment not found for source ID: ${source_id}`)
    err.statusCode = 404
    throw err
  }

  console.log(
    `Found Payment Request Payment with ID: ${paymentRequestPayment.id} for source ID: ${source_id}`
  )

  const paymentRequestUser = paymentRequestPayment.User
  if (!paymentRequestUser) {
    console.error(`Payment Request User not found for source ID: ${source_id}`)
    const err: any = new Error(`Payment Request User not found for source ID: ${source_id}`)
    err.statusCode = 404
    throw err
  }

  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)
  if (!paymentRequestBalance) {
    console.error(`Payment Request Balance not found for User ID: ${paymentRequestUser.id}`)
    const err: any = new Error(
      `Payment Request Balance not found for User ID: ${paymentRequestUser.id}`
    )
    err.statusCode = 500
    throw err
  }

  const existingDebit = await models.PaymentRequestBalanceTransaction.findOne({
    where: {
      sourceId: source_id,
      reason: 'DISPUTE',
      type: 'DEBIT'
    }
  })
  if (existingDebit) {
    console.log(
      `Skipping duplicate DISPUTE DEBIT for source ${source_id} (existing tx ${existingDebit.id})`
    )
    return existingDebit
  }

  let opened: number | Date = resolveOpenedAt(openedAt)
  if (openedAt == null && dispute_id) {
    try {
      const stripeDispute = await stripe.disputes.retrieve(dispute_id)
      if (stripeDispute?.created != null) opened = stripeDispute.created
    } catch (e) {
      // Whop dispute ids are not Stripe ids — fall back to now
      console.warn(
        `Could not retrieve Stripe dispute ${dispute_id}; using provided/fallback openedAt`,
        (e as any)?.message
      )
    }
  }

  const finalAmount =
    amount + calculateAmountWithPercent(amount, 8, 'centavos', 'usd').centavosFee + (fee || 0)

  const paymentRequestBalanceTransactionForDisputeFee =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: source_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: -finalAmount,
      type: 'DEBIT',
      reason: 'DISPUTE',
      reason_details: reason,
      status: status,
      openedAt: opened,
      closedAt: closedAt
    })

  await paymentRequestBalanceTransactionForDisputeFee.reload({
    include: [
      {
        model: models.PaymentRequestBalance
      }
    ]
  })

  console.log(`Created PaymentRequestBalanceTransaction DEBIT for Dispute source: ${source_id}`)

  PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    paymentRequestUser,
    paymentRequestPayment,
    paymentRequestBalanceTransactionForDisputeFee
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Dispute ID: ${source_id}`, mailError)
  })

  return paymentRequestBalanceTransactionForDisputeFee
}

/**
 * Close dispute. On won: CREDIT amount + fee (cents) if a matching DEBIT exists and no CREDIT yet.
 */
export const closeDisputeForPaymentRequest = async ({
  source_id,
  status,
  dispute
}: DisputeDataClosed): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
  if (!paymentRequestPayment) {
    console.error(`Payment Request Payment not found for source ID: ${source_id}`)
    return {}
  }
  const paymentRequestUser = paymentRequestPayment.User
  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  const { amount, balance_transactions, reason, created } = dispute || {}

  if (status === 'won') {
    const existingCredit = await models.PaymentRequestBalanceTransaction.findOne({
      where: {
        sourceId: source_id,
        reason: 'DISPUTE',
        type: 'CREDIT'
      }
    })
    const existingDebit = await models.PaymentRequestBalanceTransaction.findOne({
      where: {
        sourceId: source_id,
        reason: 'DISPUTE',
        type: 'DEBIT'
      }
    })

    if (existingCredit) {
      console.log(`Skipping duplicate DISPUTE CREDIT for source ${source_id}`)
    } else if (!existingDebit) {
      console.warn(
        `No DISPUTE DEBIT found for source ${source_id}; skipping won CREDIT to avoid orphan credit`
      )
    } else {
      const fee = balance_transactions?.[0]?.fee || 0
      const finalAmount = (amount || 0) + (fee || 0)

      const paymentRequestBalanceTransactionForDisputeFee =
        await models.PaymentRequestBalanceTransaction.create({
          sourceId: source_id,
          paymentRequestBalanceId: paymentRequestBalance.id,
          amount: finalAmount,
          type: 'CREDIT',
          reason: 'DISPUTE',
          reason_details: reason,
          status: status,
          openedAt: created,
          closedAt: resolveClosedAtFromCreated(created)
        })

      await paymentRequestBalanceTransactionForDisputeFee.reload({
        include: [
          {
            model: models.PaymentRequestBalance
          }
        ]
      })

      console.log(
        `Created PaymentRequestBalanceTransaction CREDIT for Dispute source: ${source_id}`
      )
    }
  }

  PaymentRequestMail.newDisputeClosedForPaymentRequest(
    paymentRequestUser,
    status,
    dispute,
    paymentRequestPayment
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Dispute ID: ${source_id}`, mailError)
  })
  return {}
}
