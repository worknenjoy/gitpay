/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import Stripe from '../../../client/payment/stripe'
import { payoutCreated } from '../../../modules/webhooks/payouts'
import { payoutUpdated } from '../../../modules/webhooks/payouts'
import { payoutFailed } from '../../../modules/webhooks/payouts'
import { payoutPaid } from '../../../modules/webhooks/payouts'

const stripe = Stripe()

exports.webhookConnect = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CONNECT

  let event

  try {
    if (process.env.NODE_ENV === 'test') {
      event =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? JSON.parse(req.body.toString())
          : req.body
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, secret)
    }
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('✅ Received event:', event.type)

  if (event) {
    const paid = event.data.object.paid || false
    const status = event.data.object.status

    switch (event.type) {
      case 'payout.created':
        return await payoutCreated(event, req, res)
      case 'payout.failed':
        return await payoutFailed(event, req, res)
      case 'payout.paid':
        return await payoutPaid(event, req, res)
      case 'payout.updated':
        return await payoutUpdated(event, req, res)
      default:
        return res.status(200).json(event)
    }
  } else {
    return res.send(false)
  }
}
