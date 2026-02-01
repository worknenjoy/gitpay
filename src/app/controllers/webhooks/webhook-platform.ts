/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const stripe = require('../../../client/payment/stripe').default()
const chargeSucceeded = require('../../../modules/webhooks/chargeSucceeded')
const checkoutSessionCompleted = require('../../../modules/webhooks/checkoutSessionCompleted')
const customerSourceCreated = require('../../../modules/webhooks/customerSourceCreated')
const chargeUpdated = require('../../../modules/webhooks/chargeUpdated')
const chargeFailed = require('../../../modules/webhooks/chargeFailed')
import { handleChargeRefunded } from '../../../modules/webhooks/charges/chargeRefunded/chargeRefunded'
import {
  chargeDisputeCreatedWebhookHandler,
  chargeDisputeClosedWebhookHandler
} from '../../../modules/webhooks/charges'
const invoiceCreated = require('../../../modules/webhooks/invoiceCreated')
const invoiceUpdated = require('../../../modules/webhooks/invoiceUpdated')
const invoicePaid = require('../../../modules/webhooks/invoicePaid')
const invoiceFinalized = require('../../../modules/webhooks/invoiceFinalized')
import { transferCreated } from '../../../modules/webhooks/transfers'
import { transferReversed } from '../../../modules/webhooks/transfers'
import { chargeDisputeFundsWithdrawnWebhookHandler } from '../../../modules/webhooks/charges/chargeDisputeFundsWithdrawn/chargeDisputeFundsWithdrawn'
const balanceAvailable = require('../../../modules/webhooks/balanceAvailable')
const invoicePaymentSucceeded = require('../../../modules/webhooks/invoicePaymentSucceeded')
const invoicePaymentFailed = require('../../../modules/webhooks/invoicePaymentFailed')

exports.webhookPlatform = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET_PLATFORM

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
      case 'customer.source.created':
        return customerSourceCreated(event, req, res)
      case 'charge.updated':
        return chargeUpdated(event, paid, status, req, res)
      case 'charge.refunded':
        return handleChargeRefunded(event, req, res)
      case 'charge.succeeded':
        return chargeSucceeded(event, paid, status, req, res)
      case 'charge.failed':
        return chargeFailed(event, paid, status, req, res)
      case 'charge.dispute.created':
        return chargeDisputeCreatedWebhookHandler(event, req, res)
      case 'charge.dispute.funds_withdrawn':
        return chargeDisputeFundsWithdrawnWebhookHandler(event, req, res)
      case 'charge.dispute.closed':
        return chargeDisputeClosedWebhookHandler(event, req, res)
      case 'invoice.created':
        return await invoiceCreated(event, req, res)
      case 'invoice.updated':
        return await invoiceUpdated(event, req, res)
      case 'invoice.paid':
        return await invoicePaid(event, req, res)
      case 'invoice.finalized':
        return await invoiceFinalized(event, req, res)
      case 'transfer.created':
        return await transferCreated(event, req, res)
      case 'transfer.reversed':
        return await transferReversed(event, req, res)
      case 'balance.available':
        return balanceAvailable(event, req, res)
      case 'invoice.payment_succeeded':
        return await invoicePaymentSucceeded(event, req, res)
      case 'invoice.payment_failed':
        return await invoicePaymentFailed(event, req, res)
      case 'checkout.session.completed':
        return await checkoutSessionCompleted(event, req, res)
      default:
        return res.status(200).json(event) // Respond with 200 OK for unhandled events
    }
  } else {
    return res.send(false)
  }
}
