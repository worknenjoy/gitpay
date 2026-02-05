import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import api from '../../../src/server'
import nock from 'nock'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, WalletFactory, WalletOrderFactory } from '../../factories'
import PaymentMail from '../../../src/modules/mail/payment'
import stripe from '../../../src/client/payment/stripe'
import customerData from '../../data/stripe/stripe.customer'
import invoiceData from '../../data/stripe/stripe.invoice.basic'

const agent = request.agent(api)
const models = Models as any

describe('PayPal Notifications', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Wallet)

    // PlanSchemas are required by order creation for "open source" plan.
    // They are not truncated above, so ensure they exist deterministically.
    await models.PlanSchema.findOrCreate({
      where: { plan: 'open source', name: 'Open Source - default', feeType: 'charge' },
      defaults: {
        plan: 'open source',
        name: 'Open Source - default',
        description: 'open source',
        fee: 8,
        feeType: 'charge'
      }
    })
    await models.PlanSchema.findOrCreate({
      where: { plan: 'open source', name: 'Open Source - no fee', feeType: 'charge' },
      defaults: {
        plan: 'open source',
        name: 'Open Source - no fee',
        description: 'open source with no fee',
        fee: 0,
        feeType: 'charge'
      }
    })
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it('should call notifyNewBounty when PayPal payment completes for a public task', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    // Spy on notifyBounty since that's what's actually called
    const slackSpy = chai.spy.on(slackModule, 'notifyBounty')
    const orderAuthorize = require('../../../src/modules/orders').orderAuthorize

    // Mock PayPal API responses
    nock(process.env.PAYPAL_HOST || 'https://api.sandbox.paypal.com')
      .post('/v1/oauth2/token')
      .reply(200, JSON.stringify({ access_token: 'test_token' }))

    nock(process.env.PAYPAL_HOST || 'https://api.sandbox.paypal.com')
      .post(/\/v2\/checkout\/orders\/.*\/authorize/)
      .reply(
        200,
        JSON.stringify({
          id: 'TEST_ORDER_ID',
          purchase_units: [
            {
              payments: {
                authorizations: [
                  {
                    id: 'TEST_AUTH_ID'
                  }
                ]
              }
            }
          ]
        })
      )

    try {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/6',
        userId: user.body.id,
        title: 'Test Task',
        not_listed: false,
        private: false
      })

      const order = await OrderFactory({
        source_id: 'TEST_ORDER_ID',
        currency: 'USD',
        amount: 200,
        provider: 'paypal',
        userId: user.body.id,
        TaskId: task.id,
        token: 'TEST_TOKEN',
        status: 'open',
        paid: false
      })

      const result = await orderAuthorize({
        token: 'TEST_TOKEN',
        PayerID: 'TEST_PAYER_ID'
      })

      // Verify the order was marked as paid
      const updatedOrder = await models.Order.findOne({
        where: { token: 'TEST_TOKEN' }
      })
      expect(updatedOrder.paid).to.be.true

      // Notification should be called when PayPal payment completes
      expect(slackSpy).to.have.been.called()
      // Verify it was called with correct order data and context
      const call = slackSpy.__spy.calls[0]
      expect(Number(call[1].amount)).to.equal(200)
      expect(call[1].currency).to.equal('USD')
      expect(call[3]).to.equal('PayPal payment')
    } finally {
      chai.spy.restore(slackModule, 'notifyBounty')
      nock.cleanAll()
    }
  })

  it('should not call notifyNewBounty when PayPal payment completes for a private task', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    // Spy on notifyBountyOnSlack - the internal function that sends to Slack
    const slackSpy = chai.spy.on(slackModule, 'notifyBountyOnSlack')
    const orderAuthorize = require('../../../src/modules/orders').orderAuthorize

    // Mock PayPal API responses
    nock(process.env.PAYPAL_HOST || 'https://api.sandbox.paypal.com')
      .post('/v1/oauth2/token')
      .reply(200, JSON.stringify({ access_token: 'test_token' }))

    nock(process.env.PAYPAL_HOST || 'https://api.sandbox.paypal.com')
      .post(/\/v2\/checkout\/orders\/.*\/authorize/)
      .reply(
        200,
        JSON.stringify({
          id: 'TEST_ORDER_ID',
          purchase_units: [
            {
              payments: {
                authorizations: [
                  {
                    id: 'TEST_AUTH_ID'
                  }
                ]
              }
            }
          ]
        })
      )

    try {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/7',
        userId: user.body.id,
        title: 'Test Task',
        private: true
      })

      const order = await OrderFactory({
        source_id: 'TEST_ORDER_ID',
        currency: 'USD',
        amount: 200,
        provider: 'paypal',
        userId: user.body.id,
        TaskId: task.id,
        token: 'TEST_TOKEN_2',
        status: 'open',
        paid: false
      })

      await orderAuthorize({
        token: 'TEST_TOKEN_2',
        PayerID: 'TEST_PAYER_ID'
      })

      // Notification should NOT be sent to Slack for private tasks
      expect(slackSpy).to.not.have.been.called()
    } finally {
      chai.spy.restore(slackModule, 'notifyBountyOnSlack')
      nock.cleanAll()
    }
  })
})
