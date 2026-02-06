import Models from '../../../../models'
import PaymentRequestMail from '../../../../mail/paymentRequest'
import Stripe from '../../../../client/payment/stripe'
import { calculateAmountWithPercent } from '../../../../utils'

const stripe = Stripe()
const models = Models as any

export const handleChargeRefundedPaymentRequest = async (payment_intent: any) => {
  const { metadata } = payment_intent || {}

  const paymentRequestPaymentId = metadata.payment_request_payment_id
  const userId = metadata.user_id

  const user = await models.User.findOne({
    where: {
      id: userId
    }
  })

  const paymentRequestPayment = await models.PaymentRequestPayment.findOne({
    where: {
      id: paymentRequestPaymentId
    },
    include: [
      {
        model: models.PaymentRequest
      },
      {
        model: models.PaymentRequestCustomer
      }
    ]
  })

  const updatePaymentRequestPaymentStatus = await models.PaymentRequestPayment.update(
    {
      status: 'refunded'
    },
    {
      where: {
        id: paymentRequestPaymentId
      },
      returning: true
    }
  )

  const prPaymentStatus = updatePaymentRequestPaymentStatus[0]
  const prPaymentDetails = updatePaymentRequestPaymentStatus[1][0]

  if (prPaymentStatus) {
    const paymentRequest = await models.PaymentRequest.findOne({
      where: {
        id: prPaymentDetails.paymentRequestId
      }
    })

    if (paymentRequest) {
      const paymentRequestBalance = await models.PaymentRequestBalance.findOrCreate({
        where: {
          userId: user.id
        }
      })

      const amountReceived = payment_intent.amount
      const feeToDeduct = calculateAmountWithPercent(amountReceived, 8, 'centavos')

      const paymentRequestBalanceTransactionForRefund =
        await models.PaymentRequestBalanceTransaction.create({
          sourceId: payment_intent.id,
          paymentRequestBalanceId: paymentRequestBalance[0].id,
          amount: -feeToDeduct.centavosFee,
          type: 'DEBIT',
          reason: 'REFUND',
          reason_details: 'refund_payment_request_requested_by_customer',
          status: 'completed',
          openedAt: Math.floor(Date.now() / 1000),
          closedAt: Math.floor(Date.now() / 1000)
        })

      const balanceTransactionUpdated = await models.PaymentRequestBalanceTransaction.findOne({
        where: {
          id: paymentRequestBalanceTransactionForRefund.id
        },
        include: [
          {
            model: models.PaymentRequestBalance
          }
        ]
      })

      if (paymentRequestBalanceTransactionForRefund?.id) {
        PaymentRequestMail.newBalanceTransactionForPaymentRequest(
          user,
          paymentRequestPayment,
          balanceTransactionUpdated
        ).catch((mailError: any) => {
          console.error(
            `Failed to send email for Refund on PaymentRequest ID: ${paymentRequestBalanceTransactionForRefund.id}`,
            mailError
          )
        })
      }
    }
  }
}
