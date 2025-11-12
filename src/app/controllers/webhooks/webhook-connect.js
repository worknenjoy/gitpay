/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const moment = require('moment')
const models = require('../../../models')

const stripe = require('../../../modules/shared/stripe/stripe')()

const chargeSucceeded = require('../../../modules/webhooks/chargeSucceeded')
const checkoutSessionCompleted = require('../../../modules/webhooks/checkoutSessionCompleted')
const customerSourceCreated = require('../../../modules/webhooks/customerSourceCreated')
const chargeUpdated = require('../../../modules/webhooks/chargeUpdated')
const chargeRefunded = require('../../../modules/webhooks/chargeRefunded/chargeRefundedIssue')
const chargeFailed = require('../../../modules/webhooks/chargeFailed')
const invoiceCreated = require('../../../modules/webhooks/invoiceCreated')
const invoiceUpdated = require('../../../modules/webhooks/invoiceUpdated')
const invoicePaid = require('../../../modules/webhooks/invoicePaid')
const invoiceFinalized = require('../../../modules/webhooks/invoiceFinalized')
const transferCreated = require('../../../modules/webhooks/transferCreated')
const transferReversed = require('../../../modules/webhooks/transferReversed')
const payoutCreated = require('../../../modules/webhooks/payoutCreated')
const payoutFailed = require('../../../modules/webhooks/payoutFailed')
const payoutPaid = require('../../../modules/webhooks/payoutPaid')
const balanceAvailable = require('../../../modules/webhooks/balanceAvailable')
const invoicePaymentSucceeded = require('../../../modules/webhooks/invoicePaymentSucceeded')
const invoicePaymentFailed = require('../../../modules/webhooks/invoicePaymentFailed')
const {
  FAILED_REASON,
  CURRENCIES,
  formatStripeAmount
} = require('../../../modules/webhooks/constants')

exports.webhookConnect = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CONNECT;

  let event;
  
  try {
    if (process.env.NODE_ENV === 'test') {
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Received event:', event.type);

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
      default:
        return res.status(200).json(event);
    }
  }
  else {
    return res.send(false)
  }
}
