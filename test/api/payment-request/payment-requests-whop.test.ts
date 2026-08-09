import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import productCreate from '../../data/whop/product.create'
import planCreate from '../../data/whop/plan.create'

const agent = request.agent(api) as any
const models = Models as any

describe('POST /payment-request (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create a payment request via Whop product + plan', async () => {
    await withPaymentProvider('whop', async () => {
      nock(WHOP_API_HOST)
        .post('/api/v1/products')
        .reply(200, productCreate)
      nock(WHOP_API_HOST)
        .post('/api/v1/plans')
        .reply(200, planCreate)
      nock(WHOP_API_HOST)
        .patch(`/api/v1/plans/${planCreate.id}`)
        .reply(200, planCreate)

      const user = await registerAndLogin(agent)
      const res = await agent
        .post('/payment-requests')
        .send({
          title: 'Whop PR',
          description: 'Pay via Whop',
          amount: 100,
          currency: 'usd'
        })
        .set('Authorization', user.headers.authorization)
        .expect(201)

      expect(res.body).to.exist
      expect(res.body.provider).to.equal('whop')
      expect(res.body.payment_link_id).to.equal(planCreate.id)
      expect(res.body.payment_url).to.include('whop.com/checkout')
    })
  })
})
