import { Transaction } from 'sequelize'
import Models from '../../../models'

import { calculateAmountWithPercent } from '../../../utils'

import { findPaymentRequestByPaymentLinkId } from '../../../queries/payment-request/payment-request'
import { findOrCreatePaymentRequestBalance } from '../../../queries/payment-request/payment-request-balance'

import { updatePaymentRequestPaymentLinkActive } from '../../provider/stripe/payment-request'
import { updatePaymentIntentMetadata } from '../../provider/stripe/payment-intent'
import { createTransfer, createTransferReversal } from '../../provider/stripe/transfer'

const models = Models as any

type CheckoutSession = {
  payment_link: string | { id: string } | null
  payment_status: string
  amount_total: number
  payment_intent: string
  customer_details?: { name?: string; email?: string }
}

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
  const transferAmountCents = amountAfterFee.centavos

  let createdStripeTransferId: string | null = null
  let paymentLinkActiveChanged = false

  try {
    if (deactivate_after_payment) {
      // Keep legacy behavior: no extra Stripe retrieve call.
      await updatePaymentRequestPaymentLinkActive(paymentLinkId, false)
      paymentLinkActiveChanged = true
    }

    const result = await models.sequelize.transaction(async (tx: Transaction) => {
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
          customerId: customer.id
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

      // Stripe write: attach metadata to the PaymentIntent (kept inside tx to allow DB rollback on error).
      await updatePaymentIntentMetadata(paymentIntentId, {
        payment_request_payment_id: paymentRequestPayment.id,
        payment_request_id: paymentRequest.id,
        user_id: paymentRequest.userId
      })

      const paymentRequestBalance = await findOrCreatePaymentRequestBalance(paymentRequest.userId, {
        transaction: tx
      })

      if (!paymentRequestBalance) {
        throw new Error('Failed to find or create payment request balance')
      }

      const previousBalance = Number.parseInt(paymentRequestBalance.balance, 10) || 0
      const creditAmount = transferAmountCents
      const resultingBalance = creditAmount + previousBalance

      let balanceTransactionForEmail: any = null
      let updatedBalanceTransactionForEmail: any = null
      let transferCreated = false

      if (resultingBalance <= 0) {
        balanceTransactionForEmail = await models.PaymentRequestBalanceTransaction.create(
          {
            paymentRequestBalanceId: paymentRequestBalance.id,
            amount: creditAmount,
            type: 'CREDIT',
            reason: 'ADJUSTMENT',
            reason_details: 'payment_request_payment_applied',
            status: 'completed'
          },
          { transaction: tx }
        )
      }

      if (resultingBalance > 0) {
        if (previousBalance < 0) {
          balanceTransactionForEmail = await models.PaymentRequestBalanceTransaction.create(
            {
              paymentRequestBalanceId: paymentRequestBalance.id,
              amount: previousBalance * -1,
              type: 'CREDIT',
              reason: 'ADJUSTMENT',
              reason_details: 'payment_request_payment_applied',
              status: 'completed'
            },
            { transaction: tx }
          )
        }

        const transfer = await createTransfer({
          amount: resultingBalance,
          currency,
          destination: user?.account_id,
          description: `Payment for service using Payment Request id: ${paymentRequest.id} and Payment Request Payment id: ${paymentRequestPayment.id}`,
          metadata: {
            user_id: paymentRequest.userId,
            payment_request_id: paymentRequest.id,
            payment_request_payment_id: paymentRequestPayment.id
          },
          transfer_group: `payment_request_payment_${paymentRequestPayment.id}`
        } as any)

        if (!transfer?.id) {
          throw new Error('Failed to create transfer')
        }

        createdStripeTransferId = transfer.id
        transferCreated = true

        const paymentRequestTransferUpdate = await paymentRequest.update(
          {
            transfer_status: 'initiated',
            transfer_id: transfer.id
          },
          { transaction: tx }
        )

        if (!paymentRequestTransferUpdate) {
          throw new Error('Failed to update payment request transfer status')
        }
      }

      // Match previous behavior: when previous balance was negative, reload the transaction with its balance for email.
      if (previousBalance < 0 && balanceTransactionForEmail?.id) {
        updatedBalanceTransactionForEmail = await models.PaymentRequestBalanceTransaction.findByPk(
          balanceTransactionForEmail.id,
          { transaction: tx, include: [models.PaymentRequestBalance] }
        )
      }

      return {
        paymentRequest: paymentRequestUpdated,
        paymentRequestPayment,
        user,
        currency,
        originalAmountDecimal: originalAmount.decimal,
        transferAmountDecimal,
        resultingBalanceCents: resultingBalance,
        balanceTransactionForEmail,
        updatedBalanceTransactionForEmail,
        transferCreated
      }
    })

    return { ...result }
  } catch (error) {
    if (createdStripeTransferId) {
      await createTransferReversal(createdStripeTransferId, {}).catch(() => null)
    }

    if (paymentLinkActiveChanged) {
      await updatePaymentRequestPaymentLinkActive(paymentLinkId, true).catch(() => null)
    }

    throw error
  }
}
