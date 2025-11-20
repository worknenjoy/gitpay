import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
import PaymentRequestMail from '../../../../../src/modules/mail/paymentRequest'
// Use require to avoid TS type dependency on @types/sinon
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sinon = require('sinon')
import { disputeCreated } from '../../../../data/stripe/stripe.webhook.charge.dispute.created'
import { disputeClosed } from '../../../../data/stripe/stripe.webhook.charge.dispute.closed'
import { refundCreated } from '../../../../data/stripe/stripe.webhook.charge.refunded'
import { PaymentIntentData } from '../../../../data/stripe/stripe.paymentIntent'

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
      const paymentRequest = await models.PaymentRequest.create({
        title: 'PR for dispute created',
        description: 'Testing dispute created',
        amount: 4995,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await models.PaymentRequestCustomer.create({
        email: 'customer@example.com',
        name: 'Test Customer',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      await models.PaymentRequestPayment.create({
        amount: 4995,
        currency: 'usd',
        source: 'pi_test_123', // must match disputeCreated.object.payment_intent
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
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
        expect(dataArg.object.id).to.equal(disputeCreated.data.object.id)
        expect(dataArg.object.payment_intent).to.equal('pi_test_123')
      } finally {
        mailStub.restore()
      }
    })
    it('should create a Payment Request Balance with two transactions for a user when a charge.dispute.closed event is received', async () => {
      nock('https://api.stripe.com').get('/v1/disputes/du_test_123').reply(200, {
        created: 123
      })

      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}

      const paymentRequest = await models.PaymentRequest.create({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 5000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await models.PaymentRequestCustomer.create({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_123',
        userId: currentUser.id
      })

      const paymentRequestPayment = await models.PaymentRequestPayment.create({
        amount: 5000,
        currency: 'usd',
        source: 'pi_test_123',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(disputeClosed)
        .expect('Content-Type', /json/)
        .expect(200)

      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_dispute_closed_1')

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
      expect(paymentRequestBalanceTransaction.amount).to.equal('-6495')
      expect(paymentRequestBalanceTransaction.type).to.equal('DEBIT')
      expect(paymentRequestBalanceTransaction.reason).to.equal('DISPUTE')
      expect(paymentRequestBalanceTransaction.status).to.equal('lost')
      expect(paymentRequestBalanceTransaction.openedAt).to.be.instanceOf(Date)
      expect(paymentRequestBalanceTransaction.closedAt).to.be.instanceOf(Date)

      expect(paymentRequestBalance).to.exist
      expect(paymentRequestBalance.balance).to.equal('-6495')
    })
  })
  describe('For refunds', () => {
    it('should update balance after a refund from a payment request is triggered', async () => {
      nock('https://api.stripe.com')
        .get('/v1/payment_intents/pi_1TestPI')
        .reply(200, PaymentIntentData.forPaymentRequest)

      const user = await registerAndLogin(agent)
      const { body: currentUser } = user || {}

      const paymentRequest = await models.PaymentRequest.create({
        title: 'Test Payment Request for Refund',
        description: 'A test payment request to verify refund balance update',
        amount: 10000,
        currency: 'usd',
        userId: currentUser.id
      })

      const paymentRequestCustomer = await models.PaymentRequestCustomer.create({
        email: 'test@example.com',
        name: 'Test User',
        sourceId: 'src_test_456',
        userId: currentUser.id
      })

      const paymentRequestPayment = await models.PaymentRequestPayment.create({
        amount: 10000,
        currency: 'usd',
        source: 'pi_test_456',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      // Simulate initial balance creation after payment
      await models.PaymentRequestBalance.create({
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
  })
})
