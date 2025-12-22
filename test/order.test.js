const request = require('supertest')
const Promise = require('bluebird')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../src/server').default
const agent = request.agent(api)
const nock = require('nock')
const models = require('../src/models')
const { registerAndLogin, register, login, truncateModels } = require('./helpers')
const PaymentMail = require('../src/modules/mail/payment')
const plan = require('../src/models/plan')
const stripe = require('../src/modules/shared/stripe/stripe')()
const customerData = require('./data/stripe/stripe.customer')
const invoiceData = require('./data/stripe/stripe.invoice.basic')

describe('Orders', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Wallet)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  describe('list orders', () => {
    it('should list orders', async () => {
      const user = await registerAndLogin(agent)
      const res = await agent
        .get('/orders')
        .set('Authorization', user.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })
  })

  describe('create Order', () => {
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

    describe('Order with Plan', () => {
      let PlanSchema
      beforeEach(async () => {
        PlanSchema = await models.PlanSchema.build({
          plan: 'open source',
          name: 'Open Source - default',
          description: 'open source',
          fee: 8,
          feeType: 'charge'
        })
        PlanSchema = await models.PlanSchema.build({
          plan: 'open source',
          name: 'Open Source - no fee',
          description: 'open source with no fee',
          fee: 0,
          feeType: 'charge'
        })
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
      const invoiceItem = chai.spy.on(stripe.invoiceItems, 'create')

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
        chai.spy.restore(stripe.invoiceItems, 'create')
      }
    })

    it('should create a order type wallet funds', async () => {
      const user = await registerAndLogin(agent)
      const newWallet = await models.Wallet.create({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      })
      const WalletOrder = await models.WalletOrder.create({
        walletId: newWallet.id,
        amount: 400,
        status: 'paid'
      })
      const task = await models.Task.create({
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
      const newWallet = await models.Wallet.create({
        name: 'Test Wallet',
        balance: 0,
        userId: user.body.id
      })
      const WalletOrder = await models.WalletOrder.create({
        walletId: newWallet.id,
        amount: 1929,
        status: 'paid'
      })
      const task = await models.Task.create({
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

    it('should create a new paypal order', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
        .post(path)
        .reply(200, { access_token: 'foo' }, { 'Content-Type': 'application/json' })
      nock(url)
        .post(anotherPath)
        .reply(
          200,
          {
            id: 1,
            links: [{ href: 'http://foo.com' }, { href: 'http://foo.com' }],
            purchase_units: [
              {
                payments: {
                  authorizations: [
                    {
                      id: 'foo'
                    }
                  ]
                }
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        )

      const userAuth = await registerAndLogin(agent)
      const res = await agent
        .post('/orders')
        .set('Authorization', userAuth.headers.authorization)
        .send({
          currency: 'USD',
          provider: 'paypal',
          amount: 200,
          userId: userAuth.body.id
        })
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.currency).to.equal('USD')
      expect(res.body.amount).to.equal('200')
      expect(res.body.authorization_id).to.equal('foo')
    })

    it('should cancel a paypal order', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
        .persist()
        .post(path)
        .reply(200, { access_token: 'foo' }, { 'Content-Type': 'application/json' })
      nock(url)
        .post(anotherPath)
        .reply(
          200,
          {
            id: 1,
            links: [{ href: 'http://foo.com' }, { href: 'http://foo.com' }],
            purchase_units: [
              {
                payments: {
                  authorizations: [
                    {
                      id: 'foo'
                    }
                  ]
                }
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        )

      const user = await registerAndLogin(agent, { email: 'testcancelorder@gitpay.me' })

      chai.use(spies)
      const mailSpySuccess = chai.spy.on(PaymentMail, 'cancel')

      try {
        const order = await agent
          .post('/orders')
          .set('Authorization', user.headers.authorization)
          .send({
            currency: 'USD',
            provider: 'paypal',
            amount: 200,
            userId: user.body.id
          })
          .expect(200)

        const orderData = order.body
        const cancelPath = `/v2/payments/authorizations/foo/void`
        nock(url).post(cancelPath).reply(204)

        const canceled = await agent
          .post(`/orders/${orderData.id}/cancel`)
          .set('Authorization', user.headers.authorization)
          .send({ id: orderData.id })
          .expect(200)

        expect(canceled.statusCode).to.equal(200)
        expect(canceled.body).to.exist
        expect(canceled.body.currency).to.equal('USD')
        expect(canceled.body.amount).to.equal('200')
        expect(canceled.body.status).to.equal('canceled')
        expect(canceled.body.paid).to.equal(false)
        expect(mailSpySuccess).to.have.been.called()
      } finally {
        chai.spy.restore(PaymentMail, 'cancel')
      }
    })

    it('should fetch a paypal order with details', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
        .persist()
        .post(path)
        .reply(200, { access_token: 'foo' }, { 'Content-Type': 'application/json' })
      nock(url)
        .post(anotherPath)
        .reply(
          200,
          {
            id: 'order_foo',
            links: [{ href: 'http://foo.com' }, { href: 'http://foo.com' }],
            purchase_units: [
              {
                payments: {
                  authorizations: [
                    {
                      id: 'auth_foo'
                    }
                  ]
                }
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        )

      const user = await registerAndLogin(agent, { email: 'testcancelorder@gitpay.me' })

      const order = await agent
        .post('/orders')
        .set('Authorization', user.headers.authorization)
        .send({
          currency: 'USD',
          provider: 'paypal',
          amount: 200,
          userId: user.body.id
        })
        .expect(200)

      const orderData = order.body
      const detailsPath = `/v2/checkout/orders/${orderData.source_id}`
      nock(url).get(detailsPath).reply(200, {
        id: 'order_foo',
        status: 'CREATED'
      })

      const orderDetails = await agent
        .get(`/orders/${orderData.id}/details`)
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(orderDetails.statusCode).to.equal(200)
      expect(orderDetails.body).to.exist
      expect(orderDetails.body.currency).to.equal('USD')
      expect(orderDetails.body.amount).to.equal('200')
      expect(orderDetails.body.status).to.equal('open')
      expect(orderDetails.body.paid).to.equal(false)
      expect(orderDetails.body.paypal.status).to.equal('CREATED')
    })

    it('should authorize a paypal order', async () => {
      const order = await models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200
      }).save()

      await agent
        .get(`/orders/authorize/?paymentId=PAY-TEST&token=EC-TEST&PayerID=TESTPAYERID`)
        .expect(302)
    })

    it('should update a paypal order', async () => {
      const user = await registerAndLogin(agent, { email: 'test_update_order@gitpay.me' })
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v2/checkout/orders'
      nock(url)
        .persist()
        .post(path)
        .reply(200, { access_token: 'foo' }, { 'Content-Type': 'application/json' })
      nock(url)
        .post(anotherPath)
        .reply(
          200,
          {
            id: 'order_foo',
            links: [{ href: 'http://foo.com' }, { href: 'http://foo.com' }],
            purchase_units: [
              {
                payments: {
                  authorizations: [
                    {
                      id: 'auth_foo'
                    }
                  ]
                }
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        )

      const order = await models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200,
        provider: 'paypal'
      }).save()

      const res = await agent
        .put(`/orders/${order.dataValues.id}`)
        .set('Authorization', user.headers.authorization)
        .send({ id: order.dataValues.id })
        .expect(200)

      expect(res.body).to.exist
      expect(res.body.source_id).to.equal('order_foo')
    })

    it('should get order details simple', async () => {
      const user = await registerAndLogin(agent, { email: 'test_fetch_order@gitpay.me' })
      const order = await models.Order.build({
        source_id: '12345',
        currency: 'BRL',
        amount: 200
      }).save()

      const res = await agent
        .get(`/orders/${order.dataValues.id}/details`)
        .set('Authorization', user.headers.authorization)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.source_id).to.equal('12345')
      expect(res.body.currency).to.equal('BRL')
      expect(res.body.amount).to.equal('200')
    })
    it('should get order invoice', async () => {
      nock('https://api.stripe.com')
        .get('/v1/invoices/12345')
        .reply(200, invoiceData.created, { 'Content-Type': 'application/json' })

      const user = await registerAndLogin(agent, { email: 'test_fetch_order@gitpay.me' })
      const order = await models.Order.build({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        provider: 'stripe',
        source_type: 'invoice-item'
      }).save()

      const res = await agent
        .get(`/orders/${order.dataValues.id}/details`)
        .set('Authorization', user.headers.authorization)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.source_id).to.equal('12345')
      expect(res.body.currency).to.equal('BRL')
      expect(res.body.amount).to.equal('200')
      expect(res.body.stripe.hosted_invoice_url).to.exist
      expect(res.body.stripe.invoice_pdf).to.exist
    })
  })

  it('should transfer a Stripe order', async () => {
    const user = await registerAndLogin(agent, { email: 'test_transfer_order@gitpay.me' })

    const tasks = await Promise.all([
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7363',
        userId: user.body.id
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7364',
        userId: user.body.id,
        status: 'in_progress'
      }).save()
    ])

    const order = await models.Order.build({
      source_id: '12345',
      currency: 'BRL',
      amount: 200,
      taskId: tasks[0].dataValues.id
    }).save()

    const transferRes = await agent
      .post(`/orders/${order.dataValues.id}/transfers`)
      .send({
        taskId: tasks[1].dataValues.id
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(transferRes.statusCode).to.equal(200)
    expect(transferRes.body).to.exist
    expect(transferRes.body.source_id).to.equal('12345')
    expect(transferRes.body.currency).to.equal('BRL')
    expect(transferRes.body.amount).to.equal('200')
  })
  it('should refund order', async () => {
    const stripeRefund = {
      id: 're_1J2Yal2eZvKYlo2C0qvW9j8D',
      object: 'refund',
      amount: 200,
      balance_transaction: 'txn_1J2Yal2eZvKYlo2C0qvW9j8D',
      charge: 'ch_1J2Yal2eZvKYlo2C0qvW9j8D',
      created: 1623346623,
      currency: 'usd',
      metadata: {},
      reason: null,
      receipt_number: null,
      status: 'succeeded'
    }

    nock('https://api.stripe.com')
      .post('/v1/refunds')
      .reply(200, stripeRefund, { 'Content-Type': 'application/json' })

    try {
      const user = await registerAndLogin(agent, { email: 'test_refund_order@gitpay.me' })

      const order = await models.Order.build({
        source_id: 'PAY-TEST',
        currency: 'USD',
        amount: 200,
        provider: 'stripe',
        userId: user.body.id
      }).save()

      const refundRes = await agent
        .post(`/orders/${order.dataValues.id}/refund`)
        .set('Authorization', res.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(refundRes.statusCode).to.equal(200)
      expect(refundRes.body).to.exist
      expect(refundRes.body.id).to.equal('re_1J2Yal2eZvKYlo2C0qvW9j8D')
    } catch (error) {
      console.error(error)
    }
  })
})
