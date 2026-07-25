import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { PaymentRequestFactory } from '../../../factories'
import transferCreate from '../../../data/whop/transfer.create'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop webhooks for payment requests', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should mark payment request paid and transfer on payment.succeeded', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)
      nock(WHOP_API_HOST)
        .patch('/api/v1/plans/plan_test_whop_pr')
        .reply(200, { id: 'plan_test_whop_pr', stock: 0 })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1', account_id: 'acct_stripe_legacy' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Whop services',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_test_whop_pr',
        provider: 'whop',
        deactivate_after_payment: true,
        userId: user.body.id
      })

      const payload = {
        id: 'msg_whop_pr_1',
        api_version: 'v1',
        type: 'payment.succeeded',
        timestamp: '2026-05-12T18:42:11.041Z',
        company_id: 'biz_test_platform',
        data: {
          id: 'pay_whop_pr_1',
          status: 'succeeded',
          amount_after_fees: 92,
          total: 100,
          currency: 'usd',
          metadata: {
            purpose: 'payment_request',
            payment_link_id: 'plan_test_whop_pr'
          },
          plan: { id: 'plan_test_whop_pr' },
          user: { name: 'Customer', email: 'customer@example.com' }
        }
      }

      const res = await agent.post('/webhooks/whop').send(payload).expect(200)

      expect(res.statusCode).to.equal(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_test_whop_pr' }
      })
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_id).to.equal(transferCreate.id)
      expect(pr.transfer_status).to.equal('initiated')

      const payment = await models.PaymentRequestPayment.findOne({
        where: { paymentRequestId: pr.id }
      })
      expect(payment).to.exist
      expect(payment.source).to.equal('pay_whop_pr_1')
    })
  })

  it('should transfer when payload has no status and metadata only on plan', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      const prRow = await PaymentRequestFactory({
        title: 'Realistic Whop PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_realistic_pr',
        provider: 'whop',
        deactivate_after_payment: false,
        userId: user.body.id
      })

      // Matches real Whop payment.succeeded envelope (no status; metadata on plan)
      const payload = {
        id: 'msg_whop_pr_realistic',
        api_version: 'v1',
        type: 'payment.succeeded',
        timestamp: '2026-05-12T18:42:11.041Z',
        company_id: 'biz_test_platform',
        data: {
          id: 'pay_whop_realistic_1',
          // no status field
          amount_after_fees: 92,
          total: 100,
          currency: 'usd',
          metadata: {},
          plan: {
            id: 'plan_realistic_pr',
            metadata: {
              payment_request_id: String(prRow.id),
              purpose: 'payment_request',
              user_id: String(user.body.id)
            }
          },
          user: { name: 'Customer', email: 'customer@example.com' }
        }
      }

      await agent.post('/webhooks/whop').send(payload).expect(200)

      const pr = await models.PaymentRequest.findByPk(prRow.id)
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_id).to.equal(transferCreate.id)
    })
  })
})