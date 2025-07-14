/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const i18n = require('i18n')
const moment = require('moment')
const models = require('../../../../models')
const SendMail = require('../../../mail/mail')
const WalletMail = require('../../../mail/wallet')

const stripe = require('../../../shared/stripe/stripe')()

const chargeSucceeded = require('../../../webhooks/chargeSucceeded')
const checkoutSessionCompleted = require('../../../webhooks/checkoutSessionCompleted')
const customerSourceCreated = require('../../../webhooks/customerSourceCreated')
const chargeUpdated = require('../../../webhooks/chargeUpdated')
const chargeRefunded = require('../../../webhooks/chargeRefunded')
const chargeFailed = require('../../../webhooks/chargeFailed')
const invoiceCreated = require('../../../webhooks/invoiceCreated')
const invoiceUpdated = require('../../../webhooks/invoiceUpdated')
const invoicePaid = require('../../../webhooks/invoicePaid')
const invoiceFinalized = require('../../../webhooks/invoiceFinalized')
const transferCreated = require('../../../webhooks/transferCreated')
const payoutCreated = require('../../../webhooks/payoutCreated')
const payoutFailed = require('../../../webhooks/payoutFailed')
const payoutPaid = require('../../../webhooks/payoutPaid')
const balanceAvailable = require('../../../webhooks/balanceAvailable')
const invoicePaymentSucceeded = require('../../../webhooks/invoicePaymentSucceeded')
const invoicePaymentFailed = require('../../../webhooks/invoicePaymentFailed')
const {
  FAILED_REASON,
  CURRENCIES,
  formatStripeAmount
} = require('../../../webhooks/constants')


i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

exports.webhookConnect = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CONNECT;

  let event;
  
  try {
    if (process.env.NODE_ENV === 'test') {
      event = JSON.parse(req.body.toString());
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
      case 'customer.source.created':
        return customerSourceCreated(event, req, res)
      case 'charge.updated':
        return chargeUpdated(event, paid, status, req, res)
      case 'charge.refunded':
        return chargeRefunded(event, paid, status, req, res)
      case 'charge.succeeded':
        return chargeSucceeded(event, paid, status, req, res)
      case 'charge.failed':
        return chargeFailed(event, paid, status, req, res)
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
      case 'payout.created':
        return await payoutCreated(event, req, res)
      case 'payout.failed':
        return await payoutFailed(event, req, res)
      case 'payout.paid':
        return await payoutPaid(event, req, res)
      case 'balance.available':
        return balanceAvailable(event, req, res)
      case 'invoice.payment_succeeded':
        return await invoicePaymentSucceeded(event, req, res)
      case 'invoice.payment_failed':
        return await invoicePaymentFailed(event, req, res)
      case 'checkout.session.completed':
        return await checkoutSessionCompleted(event, req, res)
      default:
        return res.status(200).json(event);
    }
  }
  else {
    return res.send(false)
  }
}
