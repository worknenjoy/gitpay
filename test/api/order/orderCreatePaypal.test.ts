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

describe('POST /order PayPal', () => {
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
})
