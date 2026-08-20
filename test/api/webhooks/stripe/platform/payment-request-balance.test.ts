import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
import PaymentRequestMail from '../../../../../src/mail/paymentRequest'
// Use require to avoid TS type dependency on @types/sinon
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sinon = require('sinon')
import { disputeCreated } from '../../../../data/stripe/stripe.webhook.charge.dispute.created'
import {
  disputeClosedLost,
  disputeClosedWon
} from '../../../../data/stripe/stripe.webhook.charge.dispute.closed'
import { disputeFundsWithdrawn } from '../../../../data/stripe/stripe.webhook.charge.dispute.funds_withdrawn'
import { refundCreated } from '../../../../data/stripe/stripe.webhook.charge.refunded'
import {
  PaymentRequestFactory,
  PaymentRequestCustomerFactory,
  PaymentRequestPaymentFactory,
  PaymentRequestBalanceFactory
} from '../../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('Payment Request Balance Webhook', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
  })
  describe('For disputes', () => {
    it('should call PaymentRequestMail.newDisputeCreatedForPaymentRequest on charge.dispute.created with user and dispute data', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      // Create records so the webhook handler can resolve the user from the payment intent
      const paymentRequest = await PaymentRequestFactory({
        title: 'PR for dispute created',
        description: 'Testing dispute created',
        amount: 4995,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pi_test_123', // must match disputeCreated.object.payment_intent
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      // Spy/stub the mailer method to avoid sending emails and capture args
      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeCreatedForPaymentRequest')
        .resolves(true)

      try {
        await agent
          .post('/webhooks/stripe-platform')
          .send(disputeCreated)
          .expect('Content-Type', /json/)
          .expect(200)

        // Assert the mailer was called with the expected user and dispute payload
        expect(mailStub.calledOnce).to.equal(true)
        const [userArg, dataArg] = mailStub.firstCall.args
        expect(userArg).to.exist
        expect(userArg.id).to.equal(currentUser.id)
        expect(dataArg).to.exist
        expect(dataArg.id).to.equal('du_test_123')
        expect(dataArg.reason).to.equal('product_not_received')
        expect(dataArg.status).to.equal('needs_response')
      } finally {
        mailStub.restore()
      }
    })
    it('should create a Payment Request Balance for a lost dispute a user when a charge.dispute.closed event is received', async () => {
      nock('https://api.stripe.com')
        .get('/v1/disputes/du_test_123')
        .reply(200, disputeClosedLost.data.object)

      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 5000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 5000,
        currency: 'usd',
        source: 'pi_test_123',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const mailStub = sinon
        .stub(PaymentRequestMail as any, 'newDisputeClosedForPaymentRequest')
        .resolves(true)

      try {
        const res = await agent
          .post('/webhooks/stripe-platform')
          .send(disputeClosedLost)
          .expect('Content-Type', /json/)
          .expect(200)

        const event = JSON.parse(Buffer.from(res.body).toString())
        expect(event).to.exist
        expect(event.id).to.equal('evt_test_dispute_closed_1')

        const paymentRequestBalanceUpdated = await models.PaymentRequestBalance.findOne({
          where: {
            userId: currentUser.id
          }
        })

        const paymentRequestBalanceTransaction =
          await models.PaymentRequestBalanceTransaction.findOne({
            where: {
              paymentRequestBalanceId: paymentRequestBalance.id
            }
          })

        expect(paymentRequestBalanceUpdated).to.exist
        expect(paymentRequestBalanceUpdated.balance).to.equal('0')

        expect(mailStub.calledOnce).to.equal(true)
        const [userArg, statusArg, disputeArg, paymentRequestArg] = mailStub.firstCall.args

        expect(userArg).to.exist
        expect(userArg.id).to.equal(currentUser.id)
        expect(statusArg).to.equal('lost')
        expect(disputeArg).to.exist
        expect(disputeArg.id).to.equal('du_test_123')
        expect(paymentRequestArg).to.exist
        expect(paymentRequestArg.id).to.equal(paymentRequestPayment.id)
      } finally {
        mailStub.restore()
      }
    })
    it('should create a Payment Request Balance CREDIT for a won dispute when a charge.dispute.closed event is received, net of the prior DEBIT', async () => {
      // disputeService now requires a prior DISPUTE DEBIT before it will credit a
      // "won" dispute (avoids orphan credits). Seed that DEBIT first via the same
      // funds_withdrawn flow used elsewhere, retargeted to the payment_intent the
      // won-dispute fixture uses (pi_test_123).
      nock('https://api.stripe.com')
        .get('/v1/disputes/du_test_charge_dispute')
        .reply(200, disputeFundsWithdrawn.data.object)
      nock('https://api.stripe.com')
        .get('/v1/disputes/du_test_123')
        .reply(200, disputeClosedWon.data.object)

      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 5000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 5000,
        currency: 'usd',
        source: 'pi_test_123',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const disputeFundsWithdrawnOnWonIntent = {
        ...disputeFundsWithdrawn,
        data: {
          object: {
            ...disputeFundsWithdrawn.data.object,
            payment_intent: 'pi_test_123'
          }
        }
      }

      await agent
        .post('/webhooks/stripe-platform')
        .send(disputeFundsWithdrawnOnWonIntent)
        .expect('Content-Type', /json/)
        .expect(200)

      const balanceAfterDebit = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      // 4995 (amount) + 400 (8% Gitpay fee) + 1500 (Stripe dispute fee) = 6895
      expect(balanceAfterDebit.balance).to.equal('-6895')

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(disputeClosedWon)
        .expect('Content-Type', /json/)
        .expect(200)

      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_dispute_closed_1')

      const paymentRequestBalanceUpdated = await models.PaymentRequestBalance.findOne({
        where: {
          userId: currentUser.id
        }
      })

      const paymentRequestBalanceTransaction =
        await models.PaymentRequestBalanceTransaction.findOne({
          where: {
            paymentRequestBalanceId: paymentRequestBalanceUpdated.id,
            type: 'CREDIT',
            reason: 'DISPUTE'
          }
        })

      expect(paymentRequestBalanceTransaction).to.exist
      // Won-dispute CREDIT is amount + provider fee only (4995 + 1500 = 6495) —
      // it does NOT reimburse Gitpay's own 8% platform fee that was part of the DEBIT,
      // so the balance does not return fully to zero even on a won dispute.
      expect(paymentRequestBalanceTransaction.amount).to.equal('6495')
      expect(paymentRequestBalanceTransaction.type).to.equal('CREDIT')
      expect(paymentRequestBalanceTransaction.reason).to.equal('DISPUTE')
      expect(paymentRequestBalanceTransaction.status).to.equal('won')
      expect(paymentRequestBalanceTransaction.openedAt).to.be.instanceOf(Date)
      expect(paymentRequestBalanceTransaction.closedAt).to.be.instanceOf(Date)

      expect(paymentRequestBalanceUpdated).to.exist
      // -6895 (debit) + 6495 (credit) = -400 (the un-reimbursed 8% Gitpay fee)
      expect(paymentRequestBalanceUpdated.balance).to.equal('-400')
    })
    it('should create a Payment Request Balance when a charge.dispute.funds_withdrawn event is received', async () => {
      nock('https://api.stripe.com')
        .get('/v1/disputes/du_test_charge_dispute')
        .reply(200, disputeFundsWithdrawn.data.object)

      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 5000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pi_test_payment_intent',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(disputeFundsWithdrawn)
        .expect('Content-Type', /json/)
        .expect(200)

      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_charge_dispute_funds_withdrawn')

      const updatedPaymentRequestBalance = await models.PaymentRequestBalance.findOne({
        where: {
          userId: currentUser.id
        }
      })

      const paymentRequestBalanceTransaction =
        await models.PaymentRequestBalanceTransaction.findOne({
          where: {
            paymentRequestBalanceId: paymentRequestBalance.id
          }
        })

      expect(paymentRequestBalanceTransaction).to.exist
      expect(paymentRequestBalanceTransaction.amount).to.equal('-6895')
      expect(paymentRequestBalanceTransaction.type).to.equal('DEBIT')
      expect(paymentRequestBalanceTransaction.reason).to.equal('DISPUTE')
      expect(paymentRequestBalanceTransaction.status).to.equal('needs_response')
      expect(paymentRequestBalanceTransaction.openedAt).to.be.instanceOf(Date)
      expect(paymentRequestBalanceTransaction.closedAt).to.be.instanceOf(Date)

      expect(updatedPaymentRequestBalance).to.exist
      expect(updatedPaymentRequestBalance.balance).to.equal('-6895')
    })
    it('should not double-debit when a charge.dispute.funds_withdrawn event is redelivered (idempotent)', async () => {
      nock('https://api.stripe.com')
        .get('/v1/disputes/du_test_charge_dispute')
        .reply(200, disputeFundsWithdrawn.data.object)
        .persist()

      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 5000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 4995,
        currency: 'usd',
        source: 'pi_test_payment_intent',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(disputeFundsWithdrawn)
        .expect('Content-Type', /json/)
        .expect(200)

      // Webhook retry: same event, same source (payment_intent) and dispute id.
      const res2 = await agent
        .post('/webhooks/stripe-platform')
        .send(disputeFundsWithdrawn)
        .expect('Content-Type', /json/)
        .expect(200)

      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_charge_dispute_funds_withdrawn')

      const event2 = JSON.parse(Buffer.from(res2.body).toString())
      expect(event2).to.exist
      expect(event2.id).to.equal('evt_test_charge_dispute_funds_withdrawn')

      const updatedPaymentRequestBalance = await models.PaymentRequestBalance.findOne({
        where: {
          userId: currentUser.id
        }
      })

      const paymentRequestBalanceTransactions =
        await models.PaymentRequestBalanceTransaction.findAll({
          where: {
            paymentRequestBalanceId: paymentRequestBalance.id
          }
        })

      // disputeService dedupes on sourceId + reason='DISPUTE' + type='DEBIT' —
      // the redelivered webhook must not create a second row.
      expect(paymentRequestBalanceTransactions).to.have.lengthOf(1)
      expect(paymentRequestBalanceTransactions[0].amount).to.equal('-6895')
      expect(paymentRequestBalanceTransactions[0].type).to.equal('DEBIT')
      expect(paymentRequestBalanceTransactions[0].reason).to.equal('DISPUTE')
      expect(paymentRequestBalanceTransactions[0].status).to.equal('needs_response')
      expect(paymentRequestBalanceTransactions[0].openedAt).to.be.instanceOf(Date)
      expect(paymentRequestBalanceTransactions[0].closedAt).to.be.instanceOf(Date)

      expect(updatedPaymentRequestBalance).to.exist
      expect(updatedPaymentRequestBalance.balance).to.equal('-6895')
    })
  })
  describe('For refunds', () => {
    it('should update balance after a refund from a payment request is triggered', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request for Refund',
        description: 'A test payment request to verify refund balance update',
        amount: 10000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_456',
        userId: currentUser.id
      })

      const paymentRequestPayment = await PaymentRequestPaymentFactory({
        amount: 10000,
        currency: 'usd',
        source: 'pi_1TestPI', // must match refundCreated fixture's payment_intent
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      // Simulate initial balance creation after payment
      await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(refundCreated.successfullyForPaymentRequestMetadata)
        .expect('Content-Type', /json/)
        .expect(200)

      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1TestChargeRefunded')

      const paymentRequestBalance = await models.PaymentRequestBalance.findOne({
        where: {
          userId: currentUser.id
        }
      })

      const paymentRequestBalanceTransaction =
        await models.PaymentRequestBalanceTransaction.findOne({
          where: {
            paymentRequestBalanceId: paymentRequestBalance.id
          }
        })
      expect(paymentRequestBalanceTransaction).to.exist
      expect(paymentRequestBalanceTransaction.amount).to.equal('-160')
      expect(paymentRequestBalanceTransaction.type).to.equal('DEBIT')
      expect(paymentRequestBalanceTransaction.reason).to.equal('REFUND')
      expect(paymentRequestBalanceTransaction.reason_details).to.equal(
        'refund_payment_request_requested_by_customer'
      )
      expect(paymentRequestBalanceTransaction.status).to.equal('completed')
      expect(paymentRequestBalanceTransaction.closedAt).to.be.instanceOf(Date)

      expect(paymentRequestBalance).to.exist
      expect(paymentRequestBalance.balance).to.equal('-160')
    })

    it('should not double-debit when a charge.refunded event is redelivered (idempotent)', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request for redelivered Refund',
        amount: 10000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_457',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 10000,
        currency: 'usd',
        source: 'pi_1TestPI',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent
        .post('/webhooks/stripe-platform')
        .send(refundCreated.successfullyForPaymentRequestMetadata)
        .expect(200)
      await agent
        .post('/webhooks/stripe-platform')
        .send(refundCreated.successfullyForPaymentRequestMetadata)
        .expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id }
      })
      expect(transactions).to.have.lengthOf(1)

      const updatedBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(updatedBalance.balance).to.equal('-160')
    })

    it('should debit based on the actually-refunded amount for a manual partial refund, not the original charge', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request for partial Refund',
        amount: 10000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_458',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 10000,
        currency: 'usd',
        source: 'pi_1TestPartialPI', // must match the partial-refund fixture's payment_intent
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      await agent
        .post('/webhooks/stripe-platform')
        .send(refundCreated.partiallyForPaymentRequestMetadata)
        .expect(200)

      const transaction = await models.PaymentRequestBalanceTransaction.findOne({
        where: { paymentRequestBalanceId: paymentRequestBalance.id }
      })

      expect(transaction).to.exist
      // amount_refunded (2000) * 8% = 160 — NOT the original charge amount (10000) * 8% = 800
      expect(transaction.amount).to.equal('-160')

      const updatedBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(updatedBalance.balance).to.equal('-160')
    })

    it('should create separate DEBIT rows for two distinct refunds on the same payment', async () => {
      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await PaymentRequestFactory({
        title: 'Test Payment Request for multiple Refunds',
        amount: 10000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await PaymentRequestCustomerFactory({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_459',
        userId: currentUser.id
      })

      await PaymentRequestPaymentFactory({
        amount: 10000,
        currency: 'usd',
        source: 'pi_1TestPartialPI',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id,
        balance: 0
      })

      // First manual partial refund on this payment
      await agent
        .post('/webhooks/stripe-platform')
        .send(refundCreated.partiallyForPaymentRequestMetadata)
        .expect(200)

      // A second, distinct manual refund on the same payment_intent. charge.amount_refunded
      // is cumulative (2000 + 3000 = 5000), but the debit must be based on this event's own
      // refund amount (3000), not the cumulative total or the first refund's amount.
      const secondRefund = {
        ...refundCreated.partiallyForPaymentRequestMetadata,
        id: 'evt_1TestChargeSecondPartialRefunded',
        data: {
          object: {
            ...refundCreated.partiallyForPaymentRequestMetadata.data.object,
            amount_refunded: 5000,
            refunds: {
              ...refundCreated.partiallyForPaymentRequestMetadata.data.object.refunds,
              data: [
                {
                  ...refundCreated.partiallyForPaymentRequestMetadata.data.object.refunds.data[0],
                  id: 're_1TestSecondPartialRefund',
                  amount: 3000
                }
              ]
            }
          }
        }
      }

      await agent.post('/webhooks/stripe-platform').send(secondRefund).expect(200)

      const transactions = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: paymentRequestBalance.id },
        order: [['id', 'ASC']]
      })
      expect(transactions).to.have.lengthOf(2)
      expect(transactions[0].sourceId).to.equal('re_1TestPartialRefund')
      expect(transactions[0].amount).to.equal('-160')
      expect(transactions[1].sourceId).to.equal('re_1TestSecondPartialRefund')
      expect(transactions[1].amount).to.equal('-240')

      const updatedBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      // -160 (first, 2000 refunded) + -240 (second, 3000 refunded) — each based on its own amount
      expect(updatedBalance.balance).to.equal('-400')
    })
  })
})
