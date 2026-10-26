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

describe('GET /order', () => {
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

  it('should fetch order for legitimate owner', async () => {
    const user = await registerAndLogin(agent, { email: 'owner_order_fetch@gitpay.me' })
    const order = await models.Order.build({
      source_id: 'ch_test_legit_owner',
      currency: 'USD',
      amount: 150,
      userId: user.body.id
    }).save()

    const res = await agent
      .get(`/orders/${order.dataValues.id}`)
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body.source_id).to.equal('ch_test_legit_owner')
    expect(res.body.currency).to.equal('USD')
  })

  it('should return 403 Forbidden when non-owner attempts to fetch another user order', async () => {
    const owner = await registerAndLogin(agent, { email: 'victim_order_fetch@gitpay.me' })
    const attacker = await registerAndLogin(agent, { email: 'attacker_order_fetch@gitpay.me' })

    const order = await models.Order.build({
      source_id: 'ch_victim_secret_token',
      currency: 'USD',
      amount: 500,
      userId: owner.body.id
    }).save()

    const res = await agent
      .get(`/orders/${order.dataValues.id}`)
      .set('Authorization', attacker.headers.authorization)
      .expect(403)

    expect(res.body.error).to.equal('Unauthorized')
  })

  it('should return 404 Not Found when order does not exist', async () => {
    const user = await registerAndLogin(agent, { email: 'test_order_404@gitpay.me' })

    const res = await agent
      .get('/orders/999999')
      .set('Authorization', user.headers.authorization)
      .expect(404)

    expect(res.body.error).to.equal('Order not found')
  })
})
