import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider, pinWhopApiForTests } from '../../../helpers/whop'
import Models from '../../../../src/models'
import PaymentRequestMail from '../../../../src/mail/paymentRequest'
import {
  PaymentRequestFactory,
  PaymentRequestCustomerFactory,
  PaymentRequestPaymentFactory,
  PaymentRequestBalanceFactory
} from '../../../factories'
import { disputeCreated } from '../../../data/whop/webhook.dispute.created'
import { disputeUpdatedWon } from '../../../data/whop/webhook.dispute.updated.won'
import { disputeUpdatedLost } from '../../../data/whop/webhook.dispute.updated.lost'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop dispute webhooks (payment-request balance)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should DEBIT the Payment Request Balance on dispute.created ($15 provider fee + 8% Gitpay fee)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for dispute created',
        description: 'Testing whop dispute created',
        amount: 4995,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_test_123',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_dispute_1', // must match disputeCreated.data.payment.id
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeCreatedForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id }
      })

      expect(transaction).to.exist
      // 4995 (amount) + 400 (8% Gitpay fee) + 1500 ($15 WHOP_DISPUTE_FEE_CENTS default) = 6895
      expect(transaction.amount).to.equal('-6895')
      expect(transaction.type).to.equal('DEBIT')
      expect(transaction.reason).to.equal('DISPUTE')
      expect(transaction.status).to.equal('needs_response')

      expect(balance.balance).to.equal('-6895')
    })
  })

  it('should not double-debit when dispute.created is redelivered (idempotent)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for redelivered dispute',
        amount: 4995,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_test_124',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_dispute_1',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)
      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id }
      })
      expect(transactions).to.have.lengthOf(1)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balance.balance).to.equal('-6895')
    })
  })

  it('should CREDIT the Payment Request Balance on dispute.updated status=won, net of the prior DEBIT', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for won dispute',
        amount: 4995,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_test_125',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_dispute_1',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      // Prior DEBIT from the initial dispute.created event
      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)

      const balanceAfterDebit = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balanceAfterDebit.balance).to.equal('-6895')

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeClosedForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(disputeUpdatedWon).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const credit = await models.PaymentRequestBalanceTransaction.findOne({
        where: {
          paymentRequestBalanceId: paymentRequestBalance.id,
          type: 'CREDIT',
          reason: 'DISPUTE'
        }
      })

      expect(credit).to.exist
      // Won-dispute CREDIT is amount + provider fee only (4995 + 1500 = 6495) —
      // it does not reimburse Gitpay's 8% platform fee, same as the Stripe flow.
      expect(credit.amount).to.equal('6495')
      expect(credit.status).to.equal('won')

      const balanceAfterCredit = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      // -6895 (debit) + 6495 (credit) = -400
      expect(balanceAfterCredit.balance).to.equal('-400')
    })
  })

  it('should not CREDIT on dispute.updated status=lost (notify only)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for lost dispute',
        amount: 4995,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_test_126',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_dispute_1',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeClosedForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(disputeUpdatedLost).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const credit = await models.PaymentRequestBalanceTransaction.findOne({
        where: {
          paymentRequestBalanceId: paymentRequestBalance.id,
          type: 'CREDIT',
          reason: 'DISPUTE'
        }
      })
      expect(credit).to.not.exist

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      // Unchanged since the DEBIT — a lost dispute keeps the debt on the books
      expect(balance.balance).to.equal('-6895')
    })
  })

  it('should ignore dispute.created with no matching Payment Request Payment', async () => {
    await withPaymentProvider('whop', async () => {
      await agent.post('/webhooks/whop').send(disputeCreated).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(0)
    })
  })
})
