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

describe('POST /order/refund', () => {
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

  it('should refund the base order amount without deducting additional fees', async () => {
    let capturedRefundBody: any = null

    nock('https://api.stripe.com')
      .post('/v1/refunds', (body) => {
        capturedRefundBody = body
        return true
      })
      .reply(200, {
        id: 're_test_amount_check',
        object: 'refund',
        amount: 10000,
        charge: 'ch_test',
        status: 'succeeded',
        currency: 'usd',
        metadata: {}
      }, { 'Content-Type': 'application/json' })

    const user = await registerAndLogin(agent, { email: 'test_refund_amount@gitpay.me' })

    // order.amount = 100 (base task value; customer was charged $108 with 8% fee)
    const order = await models.Order.build({
      source_id: 'ch_test',
      source: 'ch_test',
      currency: 'USD',
      amount: 100,
      provider: 'stripe',
      userId: user.body.id
    }).save()

    await agent
      .post(`/orders/${order.dataValues.id}/refunds`)
      .set('Authorization', user.headers.authorization)
      .expect(200)

    // Stripe should receive 10000 centavos ($100), not 9200 ($92 with double fee deduction)
    expect(capturedRefundBody).to.exist
    expect(capturedRefundBody.amount).to.equal('10000')
  })

  it('should call PaymentMail.refund with the base order amount', async () => {
    nock('https://api.stripe.com')
      .post('/v1/refunds')
      .reply(200, {
        id: 're_test_email_spy',
        object: 'refund',
        amount: 10000,
        charge: 'ch_test_email',
        status: 'succeeded',
        currency: 'usd',
        metadata: {}
      }, { 'Content-Type': 'application/json' })

    const user = await registerAndLogin(agent, { email: 'test_refund_email_spy@gitpay.me' })

    const order = await models.Order.build({
      source_id: 'ch_test_email',
      source: 'ch_test_email',
      currency: 'USD',
      amount: 100,
      provider: 'stripe',
      userId: user.body.id
    }).save()

    chai.use(spies)
    const mailSpy = chai.spy.on(PaymentMail, 'refund')

    try {
      await agent
        .post(`/orders/${order.dataValues.id}/refunds`)
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(mailSpy).to.have.been.called()
      const orderArg = mailSpy.__spy.calls[0][2]
      expect(String(orderArg.amount)).to.equal('100')
    } finally {
      chai.spy.restore(PaymentMail, 'refund')
    }
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

    const user = await registerAndLogin(agent, { email: 'test_refund_order@gitpay.me' })

    const order = await models.Order.build({
      source_id: 'PAY-TEST',
      currency: 'USD',
      amount: 200,
      provider: 'stripe',
      userId: user.body.id
    }).save()

    const refundRes = await agent
      .post(`/orders/${order.dataValues.id}/refunds`)
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(refundRes.statusCode).to.equal(200)
    expect(refundRes.body).to.exist
    expect(refundRes.body.status).to.equal('refunded')
  })
})
