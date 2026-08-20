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

  it('should mark the payment refunded and DEBIT the Payment Request Balance by 8% of the refunded amount', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for refund',
        amount: 4995,
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
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_refund_1', // must match refundCreated.data.payment.id
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
      // 4995 * 8% = 400 (ceiled cents)
      expect(transaction.amount).to.equal('-400')
      expect(transaction.type).to.equal('DEBIT')
      expect(transaction.reason).to.equal('REFUND')
      expect(transaction.reason_details).to.equal('refund_payment_request_requested_by_customer')

      expect(balance.balance).to.equal('-400')
    })
  })

  it('should not double-debit when refund.created is redelivered (idempotent)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Whop PR for redelivered refund',
        amount: 4995,
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
        amount: 4995,
        currency: 'usd',
        source: 'pay_whop_refund_1',
        status: 'paid',
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
      expect(balance.balance).to.equal('-400')
    })
  })

  it('should ignore refund.created with no matching Payment Request Payment', async () => {
    await withPaymentProvider('whop', async () => {
      await agent.post('/webhooks/whop').send(refundCreated).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(0)
    })
  })
})
