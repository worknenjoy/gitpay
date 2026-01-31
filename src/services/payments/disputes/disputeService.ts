import Stripe from '../../../shared/stripe/stripe'
import Models from '../../../models'
import { DisputeDataCreated, DisputeDataWithdrawn, DisputeDataClosed } from './types'
import PaymentRequestMail from '../../../modules/mail/paymentRequest'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'
import { findPaymentRequestPayment } from '../../../queries/payment-request/payment-request-payment'
import { handleAmount } from '../../../modules/util/handle-amount/handle-amount'

const stripe = Stripe()
const models = Models as any

type DisputeResponse = {}

export const createDisputeForPaymentRequest = async ({
  source_id,
  dispute
}: DisputeDataCreated): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
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

export const withDrawnDisputeForPaymentRequest = async ({
  source_id,
  dispute_id,
  amount,
  fee,
  reason,
  status,
  closedAt
}: DisputeDataWithdrawn): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)

  if (!paymentRequestPayment) {
    console.error(`Payment Request Payment not found for source ID: ${source_id}`)
  } else {
    console.log(
      `Found Payment Request Payment with ID: ${paymentRequestPayment.id} for source ID: ${source_id}`
    )
  }

  const paymentRequestUser = paymentRequestPayment.User

  if (paymentRequestUser) {
    console.log(`Dispute User ID: ${paymentRequestUser.id}`)
  } else {
    console.error(`Payment Request User not found for source ID: ${source_id}`)
  }

  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  if (paymentRequestBalance) {
    console.log(
      `Found Payment Request Balance with ID: ${paymentRequestBalance.id} for User ID: ${paymentRequestUser.id}`
    )
  } else {
    console.error(`Payment Request Balance not found for User ID: ${paymentRequestUser.id}`)
  }

  const dispute = await stripe.disputes.retrieve(dispute_id)
  const finalAmount = amount + handleAmount(amount, 8, 'centavos', 'usd').centavosFee + (fee || 0)

  const paymentRequestBalanceTransactionForDisputeFee =
    await models.PaymentRequestBalanceTransaction.create({
      sourceId: source_id,
      paymentRequestBalanceId: paymentRequestBalance.id,
      amount: -finalAmount,
      type: 'DEBIT',
      reason: 'DISPUTE',
      reason_details: reason,
      status: status,
      openedAt: dispute.created,
      closedAt: closedAt
    })

  await paymentRequestBalanceTransactionForDisputeFee.reload({
    include: [
      {
        model: models.PaymentRequestBalance
      }
    ]
  })

  if (paymentRequestBalanceTransactionForDisputeFee) {
    console.log(`Created PaymentRequestBalanceTransaction for Dispute ID: ${source_id}`)
  } else {
    console.error(`Failed to create PaymentRequestBalanceTransaction for Dispute ID: ${source_id}`)
  }

  PaymentRequestMail.newBalanceTransactionForPaymentRequest(
    paymentRequestUser,
    paymentRequestPayment,
    paymentRequestBalanceTransactionForDisputeFee
  ).catch((mailError: any) => {
    console.error(`Failed to send email for Dispute ID: ${source_id}`, mailError)
  })

  return dispute
}

export const closeDisputeForPaymentRequest = async ({
  source_id,
  status,
  dispute
}: DisputeDataClosed): Promise<DisputeResponse> => {
  const paymentRequestPayment = await findPaymentRequestPayment(source_id)
  const paymentRequestUser = paymentRequestPayment.User
  const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequestUser.id)

  const { id, amount, balance_transactions, reason, created } = dispute || {}

  if (status === 'won') {
    const fee = balance_transactions[0]?.fee || 0
    const finalAmount = amount + (fee || 0)

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
        closedAt: new Date(created * 1000)
      })

    await paymentRequestBalanceTransactionForDisputeFee.reload({
      include: [
        {
          model: models.PaymentRequestBalance
        }
      ]
    })

    if (paymentRequestBalanceTransactionForDisputeFee) {
      console.log(`Created PaymentRequestBalanceTransaction for Dispute ID: ${source_id}`)
    } else {
      console.error(
        `Failed to create PaymentRequestBalanceTransaction for Dispute ID: ${source_id}`
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
