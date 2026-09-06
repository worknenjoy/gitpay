import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import productCreate from '../../data/whop/product.create'
import planCreate from '../../data/whop/plan.create'
import checkoutConfig from '../../data/whop/checkout-configuration.create'

const agent = request.agent(api) as any
const models = Models as any

describe('POST /payment-request (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create a payment request via Whop product + plan', async () => {
    await withPaymentProvider('whop', async () => {
      nock(WHOP_API_HOST)
        .post('/api/v1/products')
        .reply(200, productCreate)
      // Direct charge (default for new payment requests): fixed-amount plans route
      // through /checkout_configurations instead of standalone /plans, since that's
      // the only endpoint supporting the application_fee_amount fee-split.
      let checkoutBody: any
      nock(WHOP_API_HOST)
        .post('/api/v1/checkout_configurations', (body) => {
          checkoutBody = body
          return true
        })
        .reply(200, checkoutConfig)
      nock(WHOP_API_HOST)
        .patch(`/api/v1/plans/${checkoutConfig.plan.id}`)
        .reply(200, planCreate)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_seller_connected' },
        { where: { id: user.body.id } }
      )
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
      expect(res.body.direct_charge).to.equal(true)
      expect(res.body.payment_link_id).to.equal(checkoutConfig.plan.id)
      expect(res.body.payment_url).to.include('whop.com/checkout')

      // Regression guard: Whop rejects plan.metadata on /checkout_configurations
      // ("Invalid value for parameter 'plan.metadata'") — metadata must only ever be
      // sent at the top level of the request body, never nested under plan.
      expect(checkoutBody.plan.metadata).to.be.undefined
      expect(checkoutBody.metadata).to.exist
      expect(checkoutBody.plan.company_id).to.equal('biz_seller_connected')
      expect(checkoutBody.plan.application_fee_amount).to.be.a('number')
      expect(checkoutBody.plan.application_fee_amount).to.be.greaterThan(0)
    })
  })

  it('should block creating a Whop payment request when the user has no connected account', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      await agent
        .post('/payment-requests')
        .send({
          title: 'Whop PR',
          description: 'Pay via Whop',
          amount: 100,
          currency: 'usd'
        })
        .set('Authorization', user.headers.authorization)
        .expect(422)
    })
  })
})
