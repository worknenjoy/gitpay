import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import api from '../../../src/server'
import nock from 'nock'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, WalletFactory, WalletOrderFactory } from '../../factories'
import PaymentMail from '../../../src/mail/payment'
import stripe from '../../../src/client/payment/stripe'
import customerData from '../../data/stripe/stripe.customer'
import invoiceData from '../../data/stripe/stripe.invoice.basic'

const agent = request.agent(api)
const models = Models as any

describe('POST /order', () => {
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

  it('should create a new order', async () => {
    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'testing@gitpay.me',
        userId: user.body.id
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.equal('12345')
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('200')
  })

  it('should not call notifyNewBounty when order is created for a task with not_listed set to true', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    const slackSpy = chai.spy.on(slackModule, 'notifyBountyOnSlack')
    const orderBuilds = require('../../../src/modules/orders').orderBuilds

    try {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/1',
        userId: user.body.id,
        title: 'Test Task',
        not_listed: true
      })

      await orderBuilds({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        taskId: task.id
      })

      expect(slackSpy).to.not.have.been.called()
    } finally {
      chai.spy.restore(slackModule, 'notifyBountyOnSlack')
    }
  })

  it('should not call notifyNewBounty when order is created for a task with private set to true', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    const slackSpy = chai.spy.on(slackModule, 'notifyBountyOnSlack')
    const orderBuilds = require('../../../src/modules/orders').orderBuilds

    try {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/2',
        userId: user.body.id,
        title: 'Test Task',
        private: true
      })

      await orderBuilds({
        source_id: '12346',
        currency: 'BRL',
        amount: 200,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        taskId: task.id
      })

      expect(slackSpy).to.not.have.been.called()
    } finally {
      chai.spy.restore(slackModule, 'notifyBountyOnSlack')
    }
  })

  it('should not call notifyNewBounty when order is created (notification only on payment completion)', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    const slackSpy = chai.spy.on(slackModule, 'notifyBountyOnSlack')
    const orderBuilds = require('../../../src/modules/orders').orderBuilds

    try {
      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/3',
        userId: user.body.id,
        title: 'Test Task',
        not_listed: false,
        private: false
      })

      await orderBuilds({
        source_id: '12347',
        currency: 'BRL',
        amount: 200,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        taskId: task.id
      })

      // Notification should NOT be called when order is created, only when payment completes
      expect(slackSpy).to.not.have.been.called()
    } finally {
      chai.spy.restore(slackModule, 'notifyBountyOnSlack')
    }
  })

  it('should call notifyNewBounty when wallet payment completes for a public task', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    // Spy on notifyBounty since that's what's actually called
    const slackSpy = chai.spy.on(slackModule, 'notifyBounty')
    const orderBuilds = require('../../../src/modules/orders').orderBuilds

    try {
      const user = await registerAndLogin(agent)
      const wallet = await WalletFactory({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      })
      // Create a WalletOrder to give the wallet balance (wallet balance is calculated from WalletOrders)
      // The wallet balance is calculated as: sum of paid WalletOrders - sum of succeeded wallet Orders
      await WalletOrderFactory({
        walletId: wallet.id,
        amount: 500,
        currency: 'USD',
        status: 'paid',
        paid: true
      })
      // Reload wallet to trigger afterFind hook and recalculate balance
      await wallet.reload()
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/4',
        userId: user.body.id,
        title: 'Test Task',
        not_listed: false,
        private: false
      })

      await orderBuilds({
        walletId: wallet.id,
        currency: 'USD',
        amount: 200,
        provider: 'wallet',
        source_type: 'wallet-funds',
        userId: user.body.id,
        taskId: task.id
      })

      // Notification should be called when wallet payment completes
      expect(slackSpy).to.have.been.called()
      // Verify it was called with correct order data and context
      const call = slackSpy.__spy.calls[0]
      expect(Number(call[1].amount)).to.equal(200)
      expect(call[1].currency).to.equal('USD')
      expect(call[3]).to.equal('wallet payment')
    } finally {
      chai.spy.restore(slackModule, 'notifyBounty')
    }
  })

  it('should not call notifyNewBounty when wallet payment completes for a private task', async () => {
    chai.use(spies)
    const slackModule = require('../../../src/shared/slack')
    // Spy on notifyBountyOnSlack - the internal function that sends to Slack
    const slackSpy = chai.spy.on(slackModule, 'notifyBountyOnSlack')
    const orderBuilds = require('../../../src/modules/orders').orderBuilds

    try {
      const user = await registerAndLogin(agent)
      const wallet = await WalletFactory({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      })
      // Create a WalletOrder to give the wallet balance (wallet balance is calculated from WalletOrders)
      // The wallet balance is calculated as: sum of paid WalletOrders - sum of succeeded wallet Orders
      await WalletOrderFactory({
        walletId: wallet.id,
        amount: 500,
        currency: 'USD',
        status: 'paid',
        paid: true
      })
      // Reload wallet to trigger afterFind hook and recalculate balance
      await wallet.reload()
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/5',
        userId: user.body.id,
        title: 'Test Task',
        private: true
      })

      await orderBuilds({
        walletId: wallet.id,
        currency: 'USD',
        amount: 200,
        provider: 'wallet',
        source_type: 'wallet-funds',
        userId: user.body.id,
        taskId: task.id
      })

      // Notification should NOT be sent to Slack for private tasks
      expect(slackSpy).to.not.have.been.called()
    } finally {
      chai.spy.restore(slackModule, 'notifyBountyOnSlack')
    }
  })
})
