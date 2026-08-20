import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import api from '../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../helpers'
import { withPaymentProvider, pinWhopApiForTests } from '../../../helpers/whop'
import Models from '../../../../src/models'
import PaymentRequestMail from '../../../../src/mail/paymentRequest'
import { WHOP_DISPUTE_ALERT_FEE_CENTS } from '../../../../src/services/payments/fees/extraFeeService'
import {
  PaymentRequestFactory,
  PaymentRequestCustomerFactory,
  PaymentRequestPaymentFactory,
  PaymentRequestBalanceFactory
} from '../../../factories'
import {
  disputeAlertChargeable,
  disputeAlertFree
} from '../../../data/whop/webhook.dispute_alert.created'

const agent = request.agent(api) as any
const models = Models as any

describe('Whop dispute_alert.created webhooks (payment-request balance)', () => {
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

  async function seedPaymentRequestPayment(currentUserId: number, source: string) {
    const paymentRequest = await PaymentRequestFactory({
      title: 'Whop PR for dispute alert',
      amount: 4995,
      currency: 'usd',
      provider: 'whop',
      userId: currentUserId
    })

    const paymentRequestCustomer = await PaymentRequestCustomerFactory({
      email: 'customer@example.com',
      name: 'Test Customer',
      sourceId: 'src_whop_alert_123',
      userId: currentUserId
    })

    return PaymentRequestPaymentFactory({
      amount: 4995,
      currency: 'usd',
      source,
      status: 'paid',
      customerId: paymentRequestCustomer.id,
      paymentRequestId: paymentRequest.id,
      userId: currentUserId
    })
  }

  it('should DEBIT the alert fee and notify the seller when charge_for_alert=true', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      await seedPaymentRequestPayment(currentUser.id, 'pay_whop_alert_1')
      await PaymentRequestBalanceFactory({ userId: currentUser.id, balance: 0 })

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeAlertForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(disputeAlertChargeable).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: balance.id }
      })

      expect(transaction).to.exist
      expect(transaction.amount).to.equal(String(-WHOP_DISPUTE_ALERT_FEE_CENTS))
      expect(transaction.type).to.equal('DEBIT')
      expect(transaction.reason).to.equal('EXTRA_FEE')
      expect(transaction.reason_details).to.equal('whop_dispute_alert_fee')

      expect(balance.balance).to.equal(String(-WHOP_DISPUTE_ALERT_FEE_CENTS))
    })
  })

  it('should notify the seller but NOT debit when charge_for_alert=false', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      await seedPaymentRequestPayment(currentUser.id, 'pay_whop_alert_1')

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeAlertForPaymentRequest')
        .resolves(true)

      await agent.post('/webhooks/whop').send(disputeAlertFree).expect(200)

      expect(mailStub.calledOnce).to.equal(true)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(0)
    })
  })

  it('should not double-debit when the same alert is redelivered (idempotent)', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      await seedPaymentRequestPayment(currentUser.id, 'pay_whop_alert_1')
      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent.post('/webhooks/whop').send(disputeAlertChargeable).expect(200)
      await agent.post('/webhooks/whop').send(disputeAlertChargeable).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id }
      })
      expect(transactions).to.have.lengthOf(1)

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balance.balance).to.equal(String(-WHOP_DISPUTE_ALERT_FEE_CENTS))
    })
  })

  it('should ignore an alert with no matching Payment Request Payment', async () => {
    await withPaymentProvider('whop', async () => {
      await agent.post('/webhooks/whop').send(disputeAlertChargeable).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll()
      expect(transactions).to.have.lengthOf(0)
    })
  })

  it('should keep the alert fee and a later refund as two separate ledger rows', async () => {
    await withPaymentProvider('whop', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      await seedPaymentRequestPayment(currentUser.id, 'pay_whop_alert_1')
      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      sinon.stub(PaymentRequestMail as any, 'newDisputeAlertForPaymentRequest').resolves(true)
      sinon.stub(PaymentRequestMail as any, 'newBalanceTransactionForPaymentRequest').resolves(true)

      // Alert fires first (auto-refund path: Whop bills the alert fee up front)
      await agent.post('/webhooks/whop').send(disputeAlertChargeable).expect(200)

      // Then Whop auto-refunds the transaction
      await agent
        .post('/webhooks/whop')
        .send({
          id: 'msg_whop_alert_then_refund',
          api_version: 'v1',
          type: 'refund.created',
          timestamp: '2026-06-08T10:10:00.000Z',
          company_id: 'biz_test_platform',
          data: {
            id: 're_whop_alert_then_refund',
            amount: 49.95,
            currency: 'usd',
            status: 'succeeded',
            payment: { id: 'pay_whop_alert_1' }
          }
        })
        .expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id },
        order: [['id', 'ASC']]
      })
      expect(transactions).to.have.lengthOf(2)
      expect(transactions[0].reason).to.equal('EXTRA_FEE')
      expect(transactions[0].amount).to.equal(String(-WHOP_DISPUTE_ALERT_FEE_CENTS))
      expect(transactions[1].reason).to.equal('REFUND')
      // 4995 * 8% = 400
      expect(transactions[1].amount).to.equal('-400')

      const balance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(balance.balance).to.equal(String(-WHOP_DISPUTE_ALERT_FEE_CENTS - 400))
    })
  })
})
