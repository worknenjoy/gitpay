/* eslint-disable no-console */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
import Stripe from '../../../shared/stripe/stripe'
import Models from '../../../../models'
import { closeDisputeForPaymentRequest } from '../../../../services/payments/disputes/disputeService'

const stripe = Stripe()
const models = Models as any

export const chargeDisputeClosedWebhookHandler = async (event: any, req: any, res: any) => {
  const { data } = event || {}
  const { object } = data || {}
  const { id, payment_intent, status } = object || {}

  console.log(`Handling charge.dispute.closed for Dispute ID: ${id}`)

  try {
    await closeDisputeForPaymentRequest({
      source_id: payment_intent,
      status,
      dispute: object
    })
    return res.json(req.body)
  } catch (error) {
    console.error(`Error handling charge.dispute.closed for Dispute ID: ${id}`, error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
