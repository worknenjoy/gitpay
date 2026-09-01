import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'
import { TaskFactory } from '../../factories'
import checkoutConfig from '../../data/whop/checkout-configuration.create'
import invoiceCreate from '../../data/whop/invoice.create'

const agent = request.agent(api) as any
const models = Models as any

describe('POST /orders (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Order)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()

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
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create a bounty order with Whop checkout session', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      let productBody: any
      let checkoutBody: any

      nock(WHOP_API_HOST)
        .post('/api/v1/products', (body) => {
          productBody = body
          return true
        })
        .reply(200, { id: 'prod_bounty_1', title: 'Whop bounty task' })

      nock(WHOP_API_HOST)
        .post('/api/v1/checkout_configurations', (body) => {
          checkoutBody = body
          return true
        })
        .reply(200, checkoutConfig)

      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/9',
        userId: user.body.id,
        title: 'Whop bounty task'
      })

      const res = await agent
        .post('/orders')
        .send({
          currency: 'usd',
          amount: 100,
          email: 'funder@gitpay.me',
          userId: user.body.id,
          taskId: task.id,
          plan: 'open source',
          provider: 'whop'
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.source_id).to.equal(checkoutConfig.id)
      expect(res.body.token).to.equal(checkoutConfig.id)
      expect(res.body.payment_url).to.equal(checkoutConfig.purchase_url)
      expect(res.body.status).to.equal('open')
      expect(res.body.paid).to.not.equal(true)

      // Product is created with the issue bounty title and linked on the plan
      expect(productBody.title).to.equal('Whop bounty task')
      expect(productBody.company_id).to.equal('biz_test_platform')
      expect(checkoutBody.plan.product_id).to.equal('prod_bounty_1')
      expect(checkoutBody.plan.title).to.equal('Whop bounty task')
      expect(checkoutBody.plan.description).to.include('Whop bounty task')
    })
  })

  it('should truncate the Whop plan title to 30 characters for long issue titles', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      let productBody: any
      let checkoutBody: any

      nock(WHOP_API_HOST)
        .post('/api/v1/products', (body) => {
          productBody = body
          return true
        })
        .reply(200, { id: 'prod_bounty_2', title: 'Multi-language support / internationalize' })

      nock(WHOP_API_HOST)
        .post('/api/v1/checkout_configurations', (body) => {
          checkoutBody = body
          return true
        })
        .reply(200, checkoutConfig)

      const user = await registerAndLogin(agent)
      const longTitle =
        'Multi-language support / internationalize descriptions and display-values'
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/11',
        userId: user.body.id,
        title: longTitle
      })

      await agent
        .post('/orders')
        .send({
          currency: 'usd',
          amount: 100,
          email: 'funder@gitpay.me',
          userId: user.body.id,
          taskId: task.id,
          plan: 'open source',
          provider: 'whop'
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      // Product title allows up to 80 chars and keeps the full issue title.
      expect(productBody.title).to.equal(longTitle)
      // Plan title must respect Whop's 30-char limit, which caused the "Title is
      // too long (maximum is 30 characters)" production error before this fix.
      expect(checkoutBody.plan.title.length).to.be.at.most(30)
      expect(checkoutBody.plan.title).to.equal(longTitle.slice(0, 30))
      // The full issue title and a link back to it must still be reachable via description.
      expect(checkoutBody.plan.description).to.include(longTitle)
      expect(checkoutBody.plan.description).to.include('/task/')
    })
  })

  it('should create a bounty invoice order via Whop invoices', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).post('/api/v1/invoices').reply(200, invoiceCreate)

      const user = await registerAndLogin(agent)
      const task = await TaskFactory({
        url: 'https://github.com/test/repo/issues/10',
        userId: user.body.id,
        title: 'Invoice bounty'
      })

      const res = await agent
        .post('/orders')
        .send({
          currency: 'usd',
          amount: 50,
          email: user.body.email,
          userId: user.body.id,
          taskId: task.id,
          plan: 'open source',
          provider: 'whop',
          source_type: 'invoice-item'
        })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(res.body.provider).to.equal('whop')
      expect(res.body.source_id).to.equal(invoiceCreate.id)
      expect(res.body.source_type).to.equal('invoice-item')
    })
  })
})
