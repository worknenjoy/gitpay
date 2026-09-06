import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import sinon from 'sinon'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../../helpers/whop'
import Models from '../../../../src/models'
import {
  PaymentRequestFactory,
  PaymentRequestBalanceFactory,
  PaymentRequestCustomerFactory,
  PaymentRequestPaymentFactory
} from '../../../factories'
import transferCreate from '../../../data/whop/transfer.create'
import { processPendingPaymentRequestTransfers } from '../../../../src/services/paymentRequest/processPendingPaymentRequestTransfers'
import { executePaymentRequestTransfer } from '../../../../src/services/paymentRequest/executePaymentRequestTransfer'

const agent = request.agent(api) as any
const models = Models as any

const pendingLedger = {
  id: 'ldgr_test',
  balances: [
    {
      currency: 'usd',
      balance: 0,
      pending_balance: 26,
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

/**
 * Proves the negative-balance "debt recovery" path in executePaymentRequestTransfer
 * for Whop specifically: a prior lost dispute leaves PaymentRequestBalance negative,
 * and the next paid PaymentRequest either fully or partially pays it down — with the
 * partial case subject to the same available-balance settlement lag as any other
 * Whop transfer.
 */
describe('Whop payment-request balance debt recovery', () => {
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

  it('fully absorbs the debt into the new payment with no provider transfer when the debt exceeds the payment', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      // No /transfers or /ledger_accounts nock: the full-absorption branch must
      // return before any provider API call is attempted.

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      // Prior lost dispute left a $68.95 debt
      await PaymentRequestBalanceFactory({
        userId: user.body.id,
        balance: -6895
      })

      await PaymentRequestFactory({
        title: 'Debt full-absorption PR',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_debt_full',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_debt_full',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-06-10T10:00:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_debt_full_1',
            status: 'succeeded',
            amount_after_fees: 50,
            total: 50,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_debt_full'
            },
            plan: { id: 'plan_debt_full' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_debt_full' }
      })
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_status).to.equal('initiated')
      // No transfer was created — the payment was fully applied to debt
      expect(pr.transfer_id).to.be.null

      const payment = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_debt_full_1' }
      })
      expect(payment.transferStatus).to.equal('initiated')

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      const credit = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id, type: 'CREDIT', reason: 'ADJUSTMENT' }
      })

      expect(credit).to.exist
      // 50 * 0.92 → 4600 centavos (Gitpay 8% fee applied), all applied to debt
      expect(credit.amount).to.equal('4600')
      // -6895 + 4600 = -2295 — still negative, so the debt isn't fully cleared,
      // but nothing was owed to the user this cycle
      expect(balance.balance).to.equal('-2295')
    })
  })

  it('pays down the debt and transfers the remainder when Whop funds are available', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, availableLedger)
      // Idempotency-Key must be present so a retry after a failed DB write can't
      // create a second real Whop transfer for the same decision.
      nock(WHOP_API_HOST)
        .matchHeader('Idempotency-Key', /^pr_payment_transfer_\d+_\d+$/)
        .post('/api/v1/transfers')
        .reply(200, transferCreate)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      // Smaller prior debt: $20.00
      await PaymentRequestBalanceFactory({
        userId: user.body.id,
        balance: -2000
      })

      await PaymentRequestFactory({
        title: 'Debt partial-absorption PR',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_debt_partial',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_debt_partial',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-06-10T10:00:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_debt_partial_1',
            status: 'succeeded',
            amount_after_fees: 50,
            total: 50,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_debt_partial'
            },
            plan: { id: 'plan_debt_partial' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const pr = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_debt_partial' }
      })
      expect(pr.status).to.equal('paid')
      expect(pr.transfer_status).to.equal('initiated')
      // A real transfer was created for the remainder (4600 - 2000 = 2600 centavos)
      expect(pr.transfer_id).to.equal(transferCreate.id)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      const credit = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id, type: 'CREDIT', reason: 'ADJUSTMENT' }
      })

      expect(credit).to.exist
      // Old debt zeroed exactly (2000), not the full new-payment amount
      expect(credit.amount).to.equal('2000')
      expect(balance.balance).to.equal('0')
    })
  })

  it('leaves the debt untouched while the covering transfer is deferred (pending Whop balance), then clears it once the retry succeeds', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      // First attempt: available balance insufficient (typical Whop 1–4 day settlement lag)
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      const seededBalance = await PaymentRequestBalanceFactory({
        userId: user.body.id,
        balance: -2000
      })

      await PaymentRequestFactory({
        title: 'Debt deferred-absorption PR',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_debt_deferred',
        provider: 'whop',
        userId: user.body.id
      })

      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_debt_deferred',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-06-10T10:00:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_debt_deferred_1',
            status: 'succeeded',
            amount_after_fees: 50,
            total: 50,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_debt_deferred'
            },
            plan: { id: 'plan_debt_deferred' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const prAfterFirstAttempt = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_debt_deferred' }
      })
      expect(prAfterFirstAttempt.transfer_status).to.equal('pending_funds')
      expect(prAfterFirstAttempt.transfer_id).to.be.null

      const paymentAfterFirstAttempt = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_debt_deferred_1' }
      })
      expect(paymentAfterFirstAttempt.transferStatus).to.equal('pending_funds')

      const claim = await models.PaymentRequestTransfer.findByPk(paymentAfterFirstAttempt.transferId)
      expect(claim).to.exist
      expect(claim.status).to.equal('pending')
      expect(claim.transfer_id).to.be.null

      // The debt-clearing CREDIT is atomic with a successful transfer — it must
      // NOT have been written yet, and the balance must be unchanged.
      const balanceAfterFirstAttempt = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      expect(balanceAfterFirstAttempt.balance).to.equal('-2000')
      const creditAfterFirstAttempt = await models.PaymentRequestBalanceTransaction.findOne({
        where: {
          paymentRequestBalanceId: seededBalance.id,
          type: 'CREDIT',
          reason: 'ADJUSTMENT'
        }
      })
      expect(creditAfterFirstAttempt).to.not.exist

      // Retry (daily cron / manual script): funds now available
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, availableLedger)
      nock(WHOP_API_HOST).post('/api/v1/transfers').reply(200, transferCreate)

      const cronResult = await processPendingPaymentRequestTransfers()
      expect(cronResult.scanned).to.equal(1)
      expect(cronResult.transferred).to.equal(1)
      expect(cronResult.deferred).to.equal(0)
      expect(cronResult.failed).to.equal(0)

      const prAfterRetry = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_debt_deferred' }
      })
      expect(prAfterRetry.transfer_status).to.equal('initiated')
      expect(prAfterRetry.transfer_id).to.equal(transferCreate.id)

      const balanceAfterRetry = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      const creditAfterRetry = await models.PaymentRequestBalanceTransaction.findOne({
        where: {
          paymentRequestBalanceId: seededBalance.id,
          type: 'CREDIT',
          reason: 'ADJUSTMENT'
        }
      })
      expect(creditAfterRetry).to.exist
      expect(creditAfterRetry.amount).to.equal('2000')
      expect(balanceAfterRetry.balance).to.equal('0')
    })
  })
})

/**
 * Regression coverage for the gap where a Whop payment refunded while its transfer
 * was still deferred (pending_funds) would still get transferred to the seller by
 * the daily cron, since the refund webhook only debits 8% of the balance (not the
 * full amount) and never touches transferStatus. executePaymentRequestTransfer now
 * guards against this by checking PaymentRequestPayment.status === 'refunded'
 * before ever calling the provider.
 */
describe('Whop payment-request transfer skipped after refund during pending_funds', () => {
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

  it('never transfers a payment that was refunded while deferred, and resolves the claim as refunded', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      // First attempt: available balance insufficient (typical Whop 1–4 day settlement lag)
      nock(WHOP_API_HOST)
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, pendingLedger)

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      await PaymentRequestBalanceFactory({
        userId: user.body.id,
        balance: 0
      })

      await PaymentRequestFactory({
        title: 'Refund during pending_funds PR',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_refund_pending',
        provider: 'whop',
        userId: user.body.id
      })

      // Customer pays — transfer is deferred because platform available balance
      // is still settling.
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_refund_pending',
          api_version: 'v1',
          type: 'payment.succeeded',
          timestamp: '2026-06-10T10:00:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 'pay_whop_refund_pending_1',
            status: 'succeeded',
            amount_after_fees: 50,
            total: 50,
            currency: 'usd',
            metadata: {
              purpose: 'payment_request',
              payment_link_id: 'plan_refund_pending'
            },
            plan: { id: 'plan_refund_pending' },
            user: { name: 'Customer', email: 'customer@example.com' }
          }
        })
        .expect(200)

      const paymentBeforeRefund = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_refund_pending_1' }
      })
      expect(paymentBeforeRefund.transferStatus).to.equal('pending_funds')

      const claimBeforeRefund = await models.PaymentRequestTransfer.findByPk(
        paymentBeforeRefund.transferId
      )
      expect(claimBeforeRefund.status).to.equal('pending')

      // Customer is refunded (support-initiated, or Whop's own Early Dispute Alert
      // auto-refund) while the transfer is still deferred.
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_refund_pending_refund',
          api_version: 'v1',
          type: 'refund.created',
          timestamp: '2026-06-11T10:00:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 're_whop_refund_pending_1',
            amount: 50,
            currency: 'usd',
            status: 'succeeded',
            payment: { id: 'pay_whop_refund_pending_1' }
          }
        })
        .expect(200)

      const paymentAfterRefund = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_refund_pending_1' }
      })
      expect(paymentAfterRefund.status).to.equal('refunded')
      // The refund webhook only debits the balance — it never touches transferStatus,
      // which is exactly why the cron's own query alone can't be relied on to skip it.
      expect(paymentAfterRefund.transferStatus).to.equal('pending_funds')

      // No /transfers or /ledger_accounts nock for this run: the refunded-payment
      // guard in executePaymentRequestTransfer must return before any provider
      // API call is attempted, or nock will throw on the unmatched request.
      const cronResult = await processPendingPaymentRequestTransfers()
      expect(cronResult.scanned).to.equal(1)
      expect(cronResult.failed).to.equal(0)
      expect(cronResult.skipped).to.equal(1)

      const paymentAfterCron = await models.PaymentRequestPayment.findOne({
        where: { source: 'pay_whop_refund_pending_1' }
      })
      expect(paymentAfterCron.transferStatus).to.equal('initiated')

      const prAfterCron = await models.PaymentRequest.findOne({
        where: { payment_link_id: 'plan_refund_pending' }
      })
      expect(prAfterCron.transfer_status).to.equal('initiated')
      expect(prAfterCron.transfer_id).to.be.null

      const claimAfterCron = await models.PaymentRequestTransfer.findByPk(
        paymentAfterCron.transferId
      )
      expect(claimAfterCron.status).to.equal('refunded')

      // No new balance transaction beyond the original 8% REFUND debit — the
      // guard resolves the record without touching the balance further.
      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: balance.id }
      })
      expect(transactions).to.have.lengthOf(1)
      expect(transactions[0].reason).to.equal('REFUND')
    })
  })
})

/**
 * Proves the pg_advisory_xact_lock in executePaymentRequestTransfer actually serializes
 * concurrent calls for the same seller. Without it, two payments settling at nearly the
 * same time could both read the same stale balance and each independently decide the
 * shared debt is cleared, under-transferring the seller and leaving the balance wrong.
 * This runs against the real Postgres test database, so the lock is genuinely exercised —
 * not mocked.
 */
describe('Whop payment-request transfer concurrency', () => {
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

  it('serializes two concurrent transfers for the same seller so a shared debt is applied exactly once', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .persist()
        .get('/api/v1/ledger_accounts/biz_test_platform')
        .reply(200, availableLedger)
      nock(WHOP_API_HOST)
        .post('/api/v1/transfers')
        .reply(200, { ...transferCreate, id: 'tr_whop_concurrent_a' })
      nock(WHOP_API_HOST)
        .post('/api/v1/transfers')
        .reply(200, { ...transferCreate, id: 'tr_whop_concurrent_b' })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_submerchant_1' },
        { where: { id: user.body.id } }
      )

      // Prior debt: $20.00 — smaller than either payment's own $46 net, so whichever
      // call the lock lets run first clears it fully; the other sees it already cleared.
      await PaymentRequestBalanceFactory({ userId: user.body.id, balance: -2000 })

      const customer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_concurrent',
        userId: user.body.id
      })

      const prA = await PaymentRequestFactory({
        title: 'Concurrent PR A',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_concurrent_a',
        provider: 'whop',
        userId: user.body.id
      })
      const prB = await PaymentRequestFactory({
        title: 'Concurrent PR B',
        amount: 50,
        currency: 'usd',
        payment_link_id: 'plan_concurrent_b',
        provider: 'whop',
        userId: user.body.id
      })

      const paymentA = await PaymentRequestPaymentFactory({
        amount: 50,
        currency: 'usd',
        source: 'pay_whop_concurrent_a',
        status: 'paid',
        customerId: customer.id,
        paymentRequestId: prA.id,
        userId: user.body.id
      })
      const paymentB = await PaymentRequestPaymentFactory({
        amount: 50,
        currency: 'usd',
        source: 'pay_whop_concurrent_b',
        status: 'paid',
        customerId: customer.id,
        paymentRequestId: prB.id,
        userId: user.body.id
      })

      const [resultA, resultB] = await Promise.all([
        executePaymentRequestTransfer({ paymentRequestPaymentId: paymentA.id }),
        executePaymentRequestTransfer({ paymentRequestPaymentId: paymentB.id })
      ])

      expect(resultA.transferCreated).to.equal(true)
      expect(resultB.transferCreated).to.equal(true)

      // Correct serialized total regardless of which call the lock let run first:
      // 4600 (net of the 2000 debt) + 4600 (no more debt left) = 7200. A race that
      // let both calls see the same stale -2000 balance would under-transfer to 5200.
      const totalTransferred = resultA.resultingBalanceCents + resultB.resultingBalanceCents
      expect(totalTransferred).to.equal(7200)

      // The 2000 debt must be cleared exactly once, by whichever call ran first.
      const debtClearingCredits = await models.PaymentRequestBalanceTransaction.findAll({
        where: { reason: 'ADJUSTMENT', type: 'CREDIT', amount: 2000 }
      })
      expect(debtClearingCredits).to.have.lengthOf(1)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: user.body.id }
      })
      expect(balance.balance).to.equal('0')
    })
  })
})
