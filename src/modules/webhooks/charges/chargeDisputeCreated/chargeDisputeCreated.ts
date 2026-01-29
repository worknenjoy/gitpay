/* eslint-disable no-console */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import Models from '../../../../models'
import { createDisputeForPaymentRequest } from '../../../../services/payments/disputes/disputeService'

const models = Models as any

export const chargeDisputeCreatedWebhookHandler = async (event: any, req: any, res: any) => {
  // Handle the charge.dispute.created event
  const { data } = event || {}
  const { object } = data || {}
  const { payment_intent } = object || {}

  console.log(`Handling charge.dispute.created for Dispute ID: ${data.object.id}`)

  try {
    await createDisputeForPaymentRequest({
      source_id: payment_intent,
      dispute: object
    })

    return res.json(req.body)
  } catch (error) {
    console.error(`Error handling charge.dispute.created for Dispute ID: ${data.object.id}`, error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
