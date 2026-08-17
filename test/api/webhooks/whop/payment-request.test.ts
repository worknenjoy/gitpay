import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import sinon from 'sinon'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../../helpers/whop'
import Models from '../../../../src/models'
import { PaymentRequestFactory } from '../../../factories'
import transferCreate from '../../../data/whop/transfer.create'
import { processPendingPaymentRequestTransfers } from '../../../../src/services/paymentRequest/processPendingPaymentRequestTransfers'
import PaymentRequestMail from '../../../../src/mail/paymentRequest'

const agent = request.agent(api) as any
const models = Models as any

const pendingLedger = {
  id: 'ldgr_test',
  balances: [
    {
      currency: 'usd',
      balance: 0,
      pending_balance: 92,
      reserve_balance: 0
    }
  ]
}

const availableLedger = {
  id: 'ldgr_test',
  balances: [
    {
      currency: 'usd',
      balance: 1000,
      pending_balance: 0,
      reserve_balance: 0
    }
  ]
}

describe('Whop webhooks for payment requests', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
    await truncateModels(models.PaymentRequestTransfer)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
    sinon.restore()
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
      expect(payment.transferStatus).to.equal('initiated')
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

  it('should store payment and defer transfer when Whop available balance is pending', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      // Preflight sees funds still pending (not available yet)
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Deferred Whop PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_deferred_pr',
        provider: 'whop',
        deactivate_after_payment: false,
        userId: user.body.id
      })

      const payload = {
        id: 'msg_whop_pr_deferred',
        api_version: 'v1',
        type: 'payment.succeeded',
        timestamp: '2026-05-12T18:42:11.041Z',
        company_id: 'biz_test_platform',
        data: {
          id: 'pay_whop_deferred_1',
          status: 'succeeded',
          amount_after_fees: 92,
          total: 100,
          currency: 'usd',
          metadata: {
            purpose: 'payment_request',
            payment_link_id: 'plan_deferred_pr'
          },
          plan: { id: 'plan_deferred_pr' },
          user: { name: 'Customer', email: 'customer@example.com' }
        }
      }

      await agent.post('/webhooks/whop').send(payload).expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_deferred_pr' }
      })
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_status).to.equal('pending_funds')
      expect(pr.transfer_id).to.be.null

      const payment = await models.PaymentRequestPayment.findOne({
        where: { paymentRequestId: pr.id }
      })
      expect(payment).to.exist
      expect(payment.source).to.equal('pay_whop_deferred_1')
      expect(payment.transferStatus).to.equal('pending_funds')
      expect(payment.transferId).to.exist

      // Claims UI lists PaymentRequestTransfer — must exist as pending while funds settle
      const claim = await models.PaymentRequestTransfer.findByPk(payment.transferId)
      expect(claim).to.exist
      expect(claim.status).to.equal('pending')
      expect(claim.transfer_id).to.be.null
      expect(claim.transfer_method).to.equal('whop')
    })
  })

  it('should treat membership.activated as paid for payment requests (plan checkout)', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Membership PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_membership_pr',
        provider: 'whop',
        userId: user.body.id
      })

      // Real Whop plan checkouts often only deliver membership.activated to the app
      const payload = {
        id: 'msg_membership_pr_1',
        api_version: 'v1',
        type: 'membership.activated',
        timestamp: '2026-05-12T18:42:11.041Z',
        company_id: 'biz_test_platform',
        data: {
          id: 'mem_whop_pr_1',
          plan: {
            id: 'plan_membership_pr',
            metadata: {
              purpose: 'payment_request'
            }
          },
          product: { id: 'prod_membership_pr', title: 'Membership PR' },
          user: { name: 'Buyer', email: 'buyer@example.com' }
        }
      }

      await agent.post('/webhooks/whop').send(payload).expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_membership_pr' }
      })
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_status).to.equal('pending_funds')

      const payment = await models.PaymentRequestPayment.findOne({
        where: { paymentRequestId: pr.id }
      })
      expect(payment).to.exist
      expect(payment.source).to.equal('mem_whop_pr_1')
      expect(payment.transferStatus).to.equal('pending_funds')

      const claim = await models.PaymentRequestTransfer.findByPk(payment.transferId)
      expect(claim).to.exist
      expect(claim.status).to.equal('pending')
    })
  })

  it('should match membership.activated when plan is a bare string id', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'String plan PR',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_string_id',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_mem_string_plan',
          api_version: 'v1',
          type: 'membership.activated',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'mem_string_plan_1',
            plan: 'plan_string_id',
            product: 'prod_string',
            user: { email: 'a@b.com', name: 'A' }
          }
        })
        .expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_string_id' }
      })
      expect(pr.status).to.equal('paid')
      const payment = await models.PaymentRequestPayment.findOne({
        where: { paymentRequestId: pr.id }
      })
      expect(payment).to.exist
    })
  })

  it('should complete deferred Whop transfer with mockSettlement when sandbox has no balance', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()

      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Mock settle Whop PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_mock_settle_pr',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_pr_mock',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_mock_1',
            status: 'succeeded',
            amount_after_fees: 92,
            total: 100,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_mock_settle_pr'
            },
            plan: { id: 'plan_mock_settle_pr' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const paymentBefore = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_mock_1' }
      })
      expect(paymentBefore.transferStatus).to.equal('pending_funds')

      // No transfer nock — mockSettlement must not call Whop
      const cronResult = await processPendingPaymentRequestTransfers({
        mockSettlement: true
      })
      expect(cronResult.scanned).to.equal(1)
      expect(cronResult.transferred).to.equal(1)
      expect(cronResult.deferred).to.equal(0)
      expect(cronResult.failed).to.equal(0)
      expect(cronResult.mockSettlement).to.equal(true)

      await paymentBefore.reload()
      expect(paymentBefore.transferStatus).to.equal('initiated')
      expect(paymentBefore.transferId).to.exist

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_mock_settle_pr' }
      })
      expect(pr.transfer_status).to.equal('initiated')
      expect(pr.transfer_id).to.match(/^mock_tr_pr_/)

      const prTransfer = await models.PaymentRequestTransfer.findByPk(paymentBefore.transferId)
      expect(prTransfer).to.exist
      expect(prTransfer.status).to.equal('created')
      expect(prTransfer.transfer_id).to.match(/^mock_tr_pr_/)
      expect(prTransfer.transfer_method).to.equal('whop')
    })
  })

  it('cron should complete deferred Whop transfer once funds are available', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()

      // First webhook: insufficient available balance
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Cron Whop PR',
        amount: 100,
        currency: 'usd',
        payment_link_id: 'plan_cron_pr',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_pr_cron',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_cron_1',
            status: 'succeeded',
            amount_after_fees: 92,
            total: 100,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_cron_pr'
            },
            plan: { id: 'plan_cron_pr' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const paymentBefore = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_cron_1' }
      })
      expect(paymentBefore.transferStatus).to.equal('pending_funds')

      // Cron run: funds available
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, availableLedger)
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)

      const cronResult = await processPendingPaymentRequestTransfers()
      expect(cronResult.scanned).to.equal(1)
      expect(cronResult.transferred).to.equal(1)
      expect(cronResult.deferred).to.equal(0)
      expect(cronResult.failed).to.equal(0)

      await paymentBefore.reload()
      expect(paymentBefore.transferStatus).to.equal('initiated')
      expect(paymentBefore.transferId).to.exist

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_cron_pr' }
      })
      expect(pr.transfer_status).to.equal('initiated')
      expect(pr.transfer_id).to.equal(transferCreate.id)

      const prTransfer = await models.PaymentRequestTransfer.findByPk(paymentBefore.transferId)
      expect(prTransfer).to.exist
      expect(prTransfer.transfer_method).to.equal('whop')
    })
  })

  it('should store payment total (gross), not amount_after_fees', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Gross amount PR',
        amount: 1,
        currency: 'usd',
        payment_link_id: 'plan_gross_amount_pr',
        provider: 'whop',
        userId: user.body.id
      })

      // Real Whop small charge: $1 total, ~$0.57 after processor fees
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_gross_1',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_gross_1',
            status: 'succeeded',
            amount_after_fees: 0.57,
            total: 1,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_gross_amount_pr'
            },
            plan: { id: 'plan_gross_amount_pr' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const payment = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_gross_1' }
      })
      expect(payment).to.exist
      // Gross charge total — not Whop processor net (0.57)
      expect(Number(payment.amount)).to.equal(1)
      // Net stored separately for claim base
      expect(Number(payment.amount_after_fees)).to.equal(0.57)
      // Claim value = net × 0.92 (centavos path ceils: 0.57*0.92 → 53¢ → 0.53)
      const claim = await models.PaymentRequestTransfer.findByPk(payment.transferId)
      expect(claim).to.exist
      expect(Number(claim.value)).to.equal(0.53)
    })
  })

  it('should process membership then payment.succeeded once (one payment-made, source upgraded to pay_)', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .times(2)
        .reply(200, pendingLedger)

      const paymentMadeStub = sinon
        .stub(PaymentRequestMail as any, 'paymentMadeForPaymentRequest')
        .resolves()
      const transferInitiatedStub = sinon
        .stub(PaymentRequestMail as any, 'transferInitiatedForPaymentRequest')
        .resolves()

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Dual event PR',
        amount: 1,
        currency: 'usd',
        payment_link_id: 'plan_dual_event_pr',
        provider: 'whop',
        deactivate_after_payment: false,
        userId: user.body.id
      })

      // 1) membership.activated (provisional source mem_…)
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_dual_mem',
          api_version: 'v1',
          type: 'membership.activated',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'mem_dual_event_1',
            plan: {
              id: 'plan_dual_event_pr',
              metadata: { purpose: 'payment_request' }
            },
            product: { id: 'prod_dual' },
            user: { name: 'Buyer', email: 'buyer@example.com' }
          }
        })
        .expect(200)

      // 2) payment.succeeded with Whop net after fees (must not create 2nd payment/email)
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_dual_pay',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:12.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_dual_event_1',
            status: 'succeeded',
            amount_after_fees: 0.57,
            total: 1,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_dual_event_pr'
            },
            plan: { id: 'plan_dual_event_pr' },
            user: { name: 'Buyer', email: 'buyer@example.com' }
          }
        })
        .expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_dual_event_pr' }
      })
      expect(pr.status).to.equal('paid')

      const payments = await models.PaymentRequestPayment.findAll({
        where: { paymentRequestId: pr.id }
      })
      expect(payments).to.have.length(1)
      expect(payments[0].source).to.equal('pay_dual_event_1')
      expect(Number(payments[0].amount)).to.equal(1)
      expect(Number(payments[0].amount_after_fees)).to.equal(0.57)

      // Claim updated to net × 0.92 after payment.succeeded upgrades amount_after_fees
      const claim = await models.PaymentRequestTransfer.findByPk(payments[0].transferId)
      expect(claim).to.exist
      expect(Number(claim.value)).to.equal(0.53)

      // One payment-made email only (gross); claim/transfer email waits until transfer succeeds
      expect(paymentMadeStub.callCount).to.equal(1)
      const paymentMadeArg = paymentMadeStub.firstCall.args[1]
      expect(Number(paymentMadeArg.amount)).to.equal(1)
      expect(transferInitiatedStub.callCount).to.equal(0)
    })
  })

  it('should process payment.succeeded then membership.activated once (no second payment-made)', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .times(2)
        .reply(200, pendingLedger)

      const paymentMadeStub = sinon
        .stub(PaymentRequestMail as any, 'paymentMadeForPaymentRequest')
        .resolves()

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Dual reverse PR',
        amount: 1,
        currency: 'usd',
        payment_link_id: 'plan_dual_reverse_pr',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_dual_rev_pay',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_dual_reverse_1',
            status: 'succeeded',
            amount_after_fees: 0.57,
            total: 1,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_dual_reverse_pr'
            },
            plan: { id: 'plan_dual_reverse_pr' },
            user: { name: 'Buyer', email: 'buyer@example.com' }
          }
        })
        .expect(200)

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_dual_rev_mem',
          api_version: 'v1',
          type: 'membership.activated',
          timestamp: '2026-05-12T18:42:12.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'mem_dual_reverse_1',
            plan: {
              id: 'plan_dual_reverse_pr',
              metadata: { purpose: 'payment_request' }
            },
            product: { id: 'prod_dual_rev' },
            user: { name: 'Buyer', email: 'buyer@example.com' }
          }
        })
        .expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_dual_reverse_pr' }
      })
      const payments = await models.PaymentRequestPayment.findAll({
        where: { paymentRequestId: pr.id }
      })
      expect(payments).to.have.length(1)
      expect(payments[0].source).to.equal('pay_dual_reverse_1')
      expect(Number(payments[0].amount)).to.equal(1)
      expect(paymentMadeStub.callCount).to.equal(1)
    })
  })

  it('should send transfer-initiated with 8% of Whop net when transfer succeeds immediately', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)

      const paymentMadeStub = sinon
        .stub(PaymentRequestMail as any, 'paymentMadeForPaymentRequest')
        .resolves()
      const transferInitiatedStub = sinon
        .stub(PaymentRequestMail as any, 'transferInitiatedForPaymentRequest')
        .resolves()

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestFactory({
        title: 'Fee email PR',
        amount: 1,
        currency: 'usd',
        payment_link_id: 'plan_fee_email_pr',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_fee_email',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-05-12T18:42:11.041Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_fee_email_1',
            status: 'succeeded',
            amount_after_fees: 0.57,
            total: 1,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_fee_email_pr'
            },
            plan: { id: 'plan_fee_email_pr' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      // Payment-made: customer gross
      expect(paymentMadeStub.callCount).to.equal(1)
      expect(Number(paymentMadeStub.firstCall.args[1].amount)).to.equal(1)

      // Claim email: fee base = Whop net $0.57, after Gitpay 8% (ceiled cents, matches Claims page) = $0.53
      expect(transferInitiatedStub.callCount).to.equal(1)
      const [, , feeBaseAmount, transferAmount] = transferInitiatedStub.firstCall.args
      expect(Number(feeBaseAmount)).to.equal(0.57)
      expect(Number(transferAmount)).to.equal(0.53)
    })
  })
})