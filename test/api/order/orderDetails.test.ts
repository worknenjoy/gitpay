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

describe('GET /order/details', () => {
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
