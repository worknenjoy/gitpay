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

describe('POST /order with plan', () => {
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

  it('should create a new order with a plan', async () => {
    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 100,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        plan: 'open source'
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.equal('12345')
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('100')
    expect(res.body.Plan.plan).to.equal('open source')
    expect(res.body.Plan.fee).to.equal('8')
    expect(res.body.Plan.feePercentage).to.equal(8)
    expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - default')
    expect(res.body.Plan.PlanSchema.feeType).to.equal('charge')
  })

  it('should create a new order with no exact amount with a plan', async () => {
    const user = await registerAndLogin(agent, { email: 'test_order@gitpay.me' })

    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 832,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        plan: 'open source'
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.equal('12345')
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('832')
    expect(res.body.Plan.plan).to.equal('open source')
    expect(res.body.Plan.fee).to.equal('66.56')
    expect(res.body.Plan.feePercentage).to.equal(8)
    expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - default')
    expect(res.body.Plan.PlanSchema.feeType).to.equal('charge')
  })

  xit('should create a new order with a plan above 5000', async () => {
    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 5000,
        email: 'testing@gitpay.me',
        userId: user.body.id,
        plan: 'open source'
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.equal('12345')
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('5000')
    expect(res.body.Plan.plan).to.equal('open source')
    expect(res.body.Plan.fee).to.equal('0')
    expect(res.body.Plan.feePercentage).to.equal(0)
    expect(res.body.Plan.PlanSchema.name).to.equal('Open Source - no fee')
    expect(res.body.Plan.PlanSchema.feeType).to.equal('charge')
  })

  it('should create a order type invoice-item and create customer if theres no customer associated', async () => {
    nock('https://api.stripe.com')
      .post('/v1/invoices')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })
    nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/send')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/finalize')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/customers')
      .reply(200, customerData.customer, { 'Content-Type': 'application/json' })

    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'test@gmail.com',
        source_type: 'invoice-item',
        customer_id: null,
        provider: 'stripe',
        userId: user.body.id,
        plan: 'open source'
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.exist
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('200')
    expect(res.body.status).to.equal('open')
    expect(res.body.Plan).to.exist
    expect(res.body.Plan.plan).to.equal('open source')
    expect(res.body.Plan.fee).to.equal('16')
    expect(res.body.Plan.feePercentage).to.equal(8)
    expect(res.body.User.id).to.equal(user.body.id)
    expect(res.body.User.customer_id).to.exist
  })

  it('should create a order type invoice-item with a existing customer', async () => {
    nock('https://api.stripe.com')
      .post('/v1/invoices')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })
    nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/send')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/finalize')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/orders')
      .send({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        email: 'test@gmail.com',
        source_type: 'invoice-item',
        customer_id: 'cus_12345',
        provider: 'stripe',
        userId: user.body.id,
        plan: 'open source'
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.exist
    expect(res.body.currency).to.equal('BRL')
    expect(res.body.amount).to.equal('200')
    expect(res.body.Plan).to.exist
    expect(res.body.Plan.plan).to.equal('open source')
    expect(res.body.Plan.fee).to.equal('16')
    expect(res.body.Plan.feePercentage).to.equal(8)
  })

  xit('should create a order type invoice-item above 5000', async () => {
    chai.use(spies)
    const stripeInstance = stripe()
    const invoiceItem = chai.spy.on(stripeInstance.invoiceItems, 'create')

    nock('https://api.stripe.com')
      .post('/v1/invoices')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })
    nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/send')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    nock('https://api.stripe.com')
      .post('/v1/invoices/foo/finalize')
      .reply(200, { id: 'foo' }, { 'Content-Type': 'application/json' })

    try {
      const user = await registerAndLogin(agent)
      const res = await agent
        .post('/orders')
        .send({
          source_id: '12345',
          currency: 'BRL',
          amount: 5000,
          email: 'test@gmail.com',
          source_type: 'invoice-item',
          customer_id: 'cus_12345',
          provider: 'stripe',
          userId: user.body.id,
          plan: 'open source'
        })
        .set('Authorization', user.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.source_id).to.exist
      expect(res.body.currency).to.equal('BRL')
      expect(res.body.amount).to.equal('5000')
      expect(res.body.Plan).to.exist
      expect(res.body.Plan.plan).to.equal('open source')
      expect(res.body.Plan.fee).to.equal('0')
      expect(res.body.Plan.feePercentage).to.equal(0)
      expect(invoiceItem).to.have.been.called()
    } finally {
      chai.spy.restore(stripeInstance.invoiceItems, 'create')
    }
  })

  it('should create a order type wallet funds', async () => {
    const user = await registerAndLogin(agent)
    const newWallet = await WalletFactory({
      name: 'Test Wallet',
      balance: 0,
      userId: user.body.id
    })
    const WalletOrder = await WalletOrderFactory({
      walletId: newWallet.id,
      amount: 400,
      status: 'paid'
    })
    const task = await TaskFactory({
      url: 'https://foo',
      userId: user.body.id
    })
    const res = await agent
      .post('/orders')
      .send({
        walletId: newWallet.id,
        currency: 'usd',
        amount: 200,
        provider: 'wallet',
        source_type: 'wallet-funds',
        userId: user.body.id,
        taskId: task.id
      })
      .set('Authorization', user.headers.authorization)
      .expect(200)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.exist
    expect(res.body.currency).to.equal('usd')
    expect(res.body.amount).to.equal('200')
    expect(res.body.status).to.equal('succeeded')
    const wallet = await models.Wallet.findOne({
      where: {
        userId: user.body.id
      }
    })
    expect(wallet.balance).to.equal('184.00')
  })

  it('should create a order type wallet funds with enough balance', async () => {
    const user = await registerAndLogin(agent)
    const newWallet = await WalletFactory({
      name: 'Test Wallet',
      balance: 0,
      userId: user.body.id
    })
    const WalletOrder = await WalletOrderFactory({
      walletId: newWallet.id,
      amount: 1929,
      status: 'paid'
    })
    const task = await TaskFactory({
      url: 'https://foo',
      userId: user.body.id
    })
    const res = await agent
      .post('/orders')
      .send({
        walletId: newWallet.id,
        currency: 'usd',
        amount: 250,
        provider: 'wallet',
        source_type: 'wallet-funds',
        userId: user.body.id,
        taskId: task.id
      })
      .set('Authorization', user.headers.authorization)
      .expect(200)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.source_id).to.exist
    expect(res.body.currency).to.equal('usd')
    expect(res.body.amount).to.equal('250')
    expect(res.body.status).to.equal('succeeded')
    const wallet = await models.Wallet.findOne({
      where: {
        userId: user.body.id
      }
    })
    expect(wallet.balance).to.equal('1659.00')
  })
})
