import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { OrderFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

describe('GET /orders/:id', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Order)
  })

  it('returns owned order payment metadata', async () => {
    const user = await registerAndLogin(agent)
    const order = await OrderFactory({ userId: user.body.id })

    const res = await agent
      .get(`/orders/${order.id}`)
      .set('Authorization', user.headers.authorization)
      .expect(200)

    expect(res.body.source_id).to.equal(order.source_id)
    expect(res.body.currency).to.equal(order.currency)
    expect(res.body.amount).to.equal('200')
  })

  it('does not return another user order payment metadata', async () => {
    const owner = await registerAndLogin(agent)
    const order = await OrderFactory({ userId: owner.body.id })
    const attacker = await registerAndLogin(agent)

    const res = await agent
      .get(`/orders/${order.id}`)
      .set('Authorization', attacker.headers.authorization)
      .expect(404)

    expect(res.body).to.deep.equal({ error: 'order.not_found' })
  })
})
