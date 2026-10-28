import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import nock from 'nock'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { OrderFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

describe('POST /orders/:id/payments ownership', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  it('does not capture another user’s PayPal authorization', async () => {
    const owner = await registerAndLogin(agent, {
      email: 'order-payment-owner@gitpay.me'
    })
    const attacker = await registerAndLogin(agent, {
      email: 'order-payment-attacker@gitpay.me'
    })
    const order = await OrderFactory({
      provider: 'paypal',
      source_id: 'PAY-OWNERSHIP-TEST',
      authorization_id: 'auth_ownership_test',
      userId: owner.body.id
    })

    const paypalScope = nock('https://api.sandbox.paypal.com')
      .post('/v1/oauth2/token')
      .reply(200, { access_token: 'foo' })
    const captureScope = nock('https://api.sandbox.paypal.com')
      .post('/v2/payments/authorizations/auth_ownership_test/capture')
      .reply(200, { id: 'captured_for_wrong_user' })

    await agent
      .post(`/orders/${order.id}/payments`)
      .set('Authorization', attacker.headers.authorization)
      .send({})
      .expect(401)

    expect(captureScope.isDone()).to.equal(false)
    expect(paypalScope.isDone()).to.equal(false)

    const unchangedOrder = await models.Order.findByPk(order.id)
    expect(unchangedOrder.transfer_id).to.equal(null)
  })
})
