import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import productCreate from '../../data/whop/product.create'
import checkoutConfig from '../../data/whop/checkout-configuration.create'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop custom-amount payment request checkout', () => {
  beforeEach(async () => {
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.User)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    process.env.FRONTEND_HOST = 'http://localhost:8082'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('creates a whop custom-amount payment request without a fixed plan, pointing payment_url at the Gitpay pay page', async () => {
    await withPaymentProvider('whop', async () => {
      nock(WHOP_API_HOST).post('/api/v1/products').reply(200, productCreate)

      const user = await registerAndLogin(agent)
      const res = await agent
        .post('/payment-requests')
        .send({
          title: 'Open amount PR',
          description: 'Pay whatever you want',
          currency: 'usd',
          custom_amount: true
        })
        .set('Authorization', user.headers.authorization)
        .expect(201)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.custom_amount).to.equal(true)
      expect(res.body.payment_link_id).to.equal(productCreate.id)
      expect(res.body.payment_url).to.equal(
        `http://localhost:8082/#/payment-requests/${res.body.id}/pay`
      )
    })
  })

  it('returns only public-safe fields from GET /payment-requests-public/:id/public', async () => {
    const user = await registerAndLogin(agent)
    const paymentRequest = await models.PaymentRequest.create({
      userId: user.body.id,
      provider: 'whop',
      custom_amount: true,
      active: true,
      title: 'Open amount PR',
      description: 'Pay whatever you want',
      currency: 'usd',
      payment_link_id: 'prod_test_whop_123',
      payment_url: 'http://localhost:8082/#/payment-requests/1/pay'
    })

    const res = await agent
      .get(`/payment-requests-public/${paymentRequest.id}/public`)
      .expect(200)

    expect(res.body).to.deep.equal({
      title: 'Open amount PR',
      description: 'Pay whatever you want',
      currency: 'usd',
      provider: 'whop',
      custom_amount: true,
      active: true
    })
    expect(res.body.payment_link_id).to.be.undefined
    expect(res.body.userId).to.be.undefined
  })

  it('404s GET /payment-requests-public/:id/public for an unknown id', async () => {
    await agent.get('/payment-requests-public/999999/public').expect(404)
  })

  describe('POST /payment-requests-public/:id/checkout', () => {
    const createCustomAmountWhopPaymentRequest = async () => {
      const user = await registerAndLogin(agent)
      return models.PaymentRequest.create({
        userId: user.body.id,
        provider: 'whop',
        custom_amount: true,
        active: true,
        title: 'Open amount PR',
        description: 'Pay whatever you want',
        currency: 'usd',
        payment_link_id: 'prod_test_whop_123',
        payment_url: 'http://localhost:8082/#/payment-requests/1/pay'
      })
    }

    it('mints a fresh Whop checkout for the entered amount and returns sessionId + purchaseUrl', async () => {
      await withPaymentProvider('whop', async () => {
        let checkoutBody: any
        nock(WHOP_API_HOST)
          .post('/api/v1/checkout_configurations', (body) => {
            checkoutBody = body
            return true
          })
          .reply(200, checkoutConfig)

        const paymentRequest = await createCustomAmountWhopPaymentRequest()

        const res = await agent
          .post(`/payment-requests-public/${paymentRequest.id}/checkout`)
          .send({ amount: 42 })
          .expect(201)

        expect(res.body.sessionId).to.equal(checkoutConfig.id)
        expect(res.body.purchaseUrl).to.equal(checkoutConfig.purchase_url)

        expect(checkoutBody.plan.product_id).to.equal('prod_test_whop_123')
        expect(checkoutBody.plan.initial_price).to.equal(42)
        expect(checkoutBody.plan.force_create_new_plan).to.equal(true)
        expect(checkoutBody.metadata.payment_request_id).to.equal(paymentRequest.id)
        expect(checkoutBody.plan.metadata).to.be.undefined
      })
    })

    it('rejects a missing/non-positive amount', async () => {
      const paymentRequest = await createCustomAmountWhopPaymentRequest()

      await agent
        .post(`/payment-requests-public/${paymentRequest.id}/checkout`)
        .send({ amount: 0 })
        .expect(400)

      await agent.post(`/payment-requests-public/${paymentRequest.id}/checkout`).send({}).expect(400)
    })

    it('rejects when the payment request does not accept a custom amount', async () => {
      const user = await registerAndLogin(agent)
      const fixed = await models.PaymentRequest.create({
        userId: user.body.id,
        provider: 'whop',
        custom_amount: false,
        active: true,
        title: 'Fixed PR',
        currency: 'usd',
        payment_link_id: 'plan_test_whop_123',
        payment_url: 'https://whop.com/checkout/plan_test_whop_123'
      })

      await agent
        .post(`/payment-requests-public/${fixed.id}/checkout`)
        .send({ amount: 42 })
        .expect(400)
    })

    it('rejects when the payment request is not on Whop', async () => {
      const user = await registerAndLogin(agent)
      const stripePr = await models.PaymentRequest.create({
        userId: user.body.id,
        provider: 'stripe',
        custom_amount: true,
        active: true,
        title: 'Stripe PR',
        currency: 'usd',
        payment_link_id: 'plink_test',
        payment_url: 'https://buy.stripe.com/test'
      })

      await agent
        .post(`/payment-requests-public/${stripePr.id}/checkout`)
        .send({ amount: 42 })
        .expect(400)
    })

    it('rejects an inactive payment request', async () => {
      const user = await registerAndLogin(agent)
      const inactive = await models.PaymentRequest.create({
        userId: user.body.id,
        provider: 'whop',
        custom_amount: true,
        active: false,
        title: 'Inactive PR',
        currency: 'usd',
        payment_link_id: 'prod_test_whop_123',
        payment_url: 'http://localhost:8082/#/payment-requests/1/pay'
      })

      await agent
        .post(`/payment-requests-public/${inactive.id}/checkout`)
        .send({ amount: 42 })
        .expect(410)
    })

    it('404s for an unknown payment request id', async () => {
      await agent
        .post('/payment-requests-public/999999/checkout')
        .send({ amount: 42 })
        .expect(404)
    })
  })
})
