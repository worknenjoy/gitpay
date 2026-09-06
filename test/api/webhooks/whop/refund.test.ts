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
import { refundCreated } from '../../../data/whop/webhook.refund.created'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop refund webhooks (payment-request balance)', () => {
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

  it('should mark the payment refunded and DEBIT the seller\'s full net take when the payment was already transferred', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for refund',
        amount: 49.95,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_refund_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 49.95,
        currency: 'usd',
        source: 'pay_whop_refund_1', // must match refundCreated.data.payment.id
        status: 'paid',
        transferStatus: 'initiated', // seller already received the transfer
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newBalanceTransactionForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const updatedPayment = await models.PaymentRequestPayment.findByPk(paymentRequestPayment.id)
      expect(updatedPayment.status).to.equal('refunded')

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id }
      })

      expect(transaction).to.exist
      // No amount_after_fees known, so the seller's full net take is 49.95 * 92% = 4596
      // cents (ceiled) — the whole thing is clawed back, not just 8% of the refund.
      expect(transaction.amount).to.equal('-4596')
      expect(transaction.type).to.equal('DEBIT')
      expect(transaction.reason).to.equal('REFUND')
      expect(transaction.reason_details).to.equal('refund_payment_request_requested_by_customer')

      expect(balance.balance).to.equal('-4596')
    })
  })

  it('should not double-debit when refund.created is redelivered (idempotent)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for redelivered refund',
        amount: 49.95,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_refund_124',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 49.95,
        currency: 'usd',
        source: 'pay_whop_refund_1',
        status: 'paid',
        transferStatus: 'initiated',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(refundCreated).expect(200)
      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id }
      })
      expect(transactions).to.have.lengthOf(1)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balance.balance).to.equal('-4596')
    })
  })

  it('should ignore refund.created with no matching Payment Request Payment', async () => {
    await withPaymentProvider('whop', async () => {
      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(0)
    })
  })

  it('should debit $0 (but still record + notify) when refunded before transfer and the processor fee is unknown', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR refunded before transfer',
        amount: 49.95,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_refund_125',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 49.95,
        currency: 'usd',
        source: 'pay_whop_refund_1',
        status: 'paid',
        transferStatus: 'pending_funds', // seller was never actually paid
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newBalanceTransactionForPaymentRequest')
        .resolves(true)

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      // Nothing to claw back — the seller never received this money, and we can't
      // quantify the platform's own processing-fee loss without amount_after_fees.
      // Still, a $0 record is created and the seller is notified.
      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(1)
      expect(transactions[0].amount).to.equal('0')
      expect(transactions[0].reason_details).to.equal(
        'refund_before_transfer_processor_fee_not_returned'
      )
      expect(mailStub.calledOnce).to.equal(true)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balance.balance).to.equal('0')
    })
  })

  it('should debit the platform\'s real processor-fee loss when refunded before transfer and amount_after_fees is known', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR refunded before transfer, known processor fee',
        amount: 49.95,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_refund_127',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 49.95,
        amount_after_fees: 47, // Whop's own real per-transaction fee already deducted
        currency: 'usd',
        source: 'pay_whop_refund_1',
        status: 'paid',
        transferStatus: 'pending_funds', // seller was never actually paid
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      // Whop auto-refunds the full $49.95 (it never returns its own fee), even though
      // the platform only ever received $47 net — a $2.95 loss caused by this seller's
      // transaction, charged to them even though they were never paid.
      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id }
      })

      expect(transaction.amount).to.equal('-295')
      expect(transaction.reason_details).to.equal(
        'refund_before_transfer_processor_fee_not_returned'
      )
      expect(balance.balance).to.equal('-295')
    })
  })

  it('should claw back the seller\'s exact net-of-Whop-fee take when amount_after_fees is known', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR with known processor fee',
        amount: 49.95,
        currency: 'usd',
        provider: 'whop',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_whop_refund_126',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 49.95,
        amount_after_fees: 47, // Whop's own real per-transaction fee already deducted
        currency: 'usd',
        source: 'pay_whop_refund_1',
        status: 'paid',
        transferStatus: 'initiated',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id }
      })

      // Seller's net take: 47 (Whop's real net) * 92% = 4324 cents exactly.
      expect(transaction.amount).to.equal('-4324')
      expect(balance.balance).to.equal('-4324')
    })
  })
})
