/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import Models from '../../models'
import PaymentRequestMail from '../mail/paymentRequest'

const models = Models as any

export const chargeDisputeCreatedWebhookHandler = async (event: any, req: any, res: any) => {
  // Handle the charge.dispute.created event
  const { data } = event

  console.log(`Handling charge.dispute.created for Dispute ID: ${data.object.id}`)

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

    const user = await models.User.findByPk(userId)

    PaymentRequestMail.newDisputeCreatedForPaymentRequest(user, data, paymentRequestPayment).catch(
      (mailError: any) => {
        console.error(`Failed to send email for Dispute ID: ${data.object.id}`, mailError)
      }
    )

    return res.json(req.body)
  } catch (error) {
    console.error(`Error handling charge.dispute.created for Dispute ID: ${data.object.id}`, error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
