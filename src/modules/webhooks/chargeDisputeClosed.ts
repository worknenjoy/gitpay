/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
import Stripe from '../shared/stripe/stripe'
import Models from '../../models'
import PaymentRequestMail from '../mail/paymentRequest'

const stripe = Stripe()
const models = Models as any

export const chargeDisputeClosedWebhookHandler = async (event: any, req: any, res: any) => {
  // Handle the charge.dispute.closed event
  const { id, object, data } = event

  console.log(`Handling charge.dispute.closed for Dispute ID: ${data.object.id}`)

  if (data.object.status !== 'lost') {
    console.log(`Dispute ID: ${data.object.id} was not lost. No action taken.`)
    return res.json(req.body)
  }

  try {
    const paymentRequestPayment = await models.PaymentRequestPayment.findOne({
      where: {
        source: data.object.payment_intent
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

    const userId = paymentRequestPayment.userId

    const paymentRequestBalance = await models.PaymentRequestBalance.findOrCreate({
      where: {
        userId
      }
    })

    const dispute = await stripe.disputes.retrieve(data.object.id)

    const paymentRequestBalanceTransactionForDisputeFee =
      await models.PaymentRequestBalanceTransaction.create({
        sourceId: data.object.id,
        paymentRequestBalanceId: paymentRequestBalance[0].id,
        amount: data.object.balance_transactions[0].net,
        type: 'DEBIT',
        reason: 'DISPUTE',
        reason_details: data.object.reason,
        status: data.object.status,
        openedAt: dispute.created,
        closedAt: data.object.created
      })

    await paymentRequestBalanceTransactionForDisputeFee.reload({
      include: [
        {
          model: models.PaymentRequestBalance
        }
      ]
    })

    if (paymentRequestBalanceTransactionForDisputeFee) {
      console.log(`Created PaymentRequestBalanceTransaction for Dispute ID: ${data.object.id}`)
    } else {
      console.error(
        `Failed to create PaymentRequestBalanceTransaction for Dispute ID: ${data.object.id}`
      )
    }

    const user = await models.User.findByPk(userId)

    PaymentRequestMail.newBalanceTransactionForPaymentRequest(
      user,
      paymentRequestPayment,
      paymentRequestBalanceTransactionForDisputeFee
    ).catch((mailError: any) => {
      console.error(`Failed to send email for Dispute ID: ${data.object.id}`, mailError)
    })

    return res.json(req.body)
  } catch (error) {
    console.error(`Error handling charge.dispute.closed for Dispute ID: ${data.object.id}`, error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
