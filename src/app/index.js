const express = require('express')
require('../models')

const routerAuth = require('./routes/auth')
const routerProject = require('./routes/projects')
const routerTask = require('./routes/tasks')
const routerTeam = require('./routes/team')
const routerOrder = require('./routes/orders')
const routerWebhook = require('./routes/webhooks')
const routerInfo = require('./routes/info')
const routerOrganization = require('./routes/organization')
const routerContact = require('./routes/contact')
const routerTypes = require('./routes/types')
const routerTaskSolution = require('./routes/taskSolutions')
const routerCoupon = require('./routes/coupon')
const routerLabel = require('./routes/label')
const routerOffer = require('./routes/offer')
const routerTransfer = require('./routes/transfer')
const routerPayout = require('./routes/payout')
const routerWallet = require('./routes/wallet')
const routerWalletOrder = require('./routes/walletOrder')
const routerLanguage = require('./routes/language')
const routerPaymentRequest = require('./routes/paymentRequest')
const routerPaymentRequestTransfer = require('./routes/paymentRequestTransfer')

import routerUsers from './routes/users'
import routerUser from './routes/user'
import routerPaymentRequestPayments from './routes/paymentRequestPayment'
import routerPaymentRequestBalance from './routes/paymentRequestBalance'
import routerDashboard from './routes/dashboard'

exports.init = (app) => {
  app.use('/webhooks', express.raw({ type: 'application/json' }), routerWebhook)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/', routerAuth)
  app.use('/users', routerUsers)
  app.use('/user', routerUser)
  app.use('/tasks', routerTask)
  app.use('/projects', routerProject)
  app.use('/team', routerTeam)
  app.use('/orders', routerOrder)
  app.use('/info', routerInfo)
  app.use('/organizations', routerOrganization)
  app.use('/types', routerTypes)
  app.use('/contact', routerContact)
  app.use('/tasksolutions', routerTaskSolution)
  app.use('/coupon', routerCoupon)
  app.use('/labels', routerLabel)
  app.use('/languages', routerLanguage)
  app.use('/offers', routerOffer)
  app.use('/transfers', routerTransfer)
  app.use('/payouts', routerPayout)
  app.use('/wallets/orders', routerWalletOrder)
  app.use('/wallets', routerWallet)
  app.use('/payment-requests', routerPaymentRequest)
  app.use('/payment-request-transfers', routerPaymentRequestTransfer)
  app.use('/payment-request-payments', routerPaymentRequestPayments)
  app.use('/payment-request-balances', routerPaymentRequestBalance)
  app.use('/dashboard', routerDashboard)
}
