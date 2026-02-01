import express from 'express'
import '../models'

import routerProject from './routes/projects'
import routerTask from './routes/tasks'
import routerTeam from './routes/team'
import routerOrder from './routes/orders'
import routerWebhook from './routes/webhooks'
import routerInfo from './routes/info'
import routerOrganization from './routes/organization'
import routerContact from './routes/contact'
import routerTypes from './routes/types'
import routerTaskSolution from './routes/taskSolutions'
import routerCoupon from './routes/coupon'
import routerLabel from './routes/label'
import routerOffer from './routes/offer'
import routerTransfer from './routes/transfer'
import routerPayout from './routes/payout'
import routerWallet from './routes/wallet'
import routerWalletOrder from './routes/walletOrder'
import routerLanguage from './routes/language'
import routerPaymentRequest from './routes/paymentRequest'
import routerPaymentRequestTransfer from './routes/paymentRequestTransfer'
import routerAuth from './routes/auth'
import routerUsers from './routes/users'
import routerUser from './routes/user'
import routerPaymentRequestPayments from './routes/paymentRequestPayment'
import routerPaymentRequestBalance from './routes/paymentRequestBalance'
import routerDashboard from './routes/dashboard'
import type { Express } from 'express'

export const init = (app: Express) => {
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
