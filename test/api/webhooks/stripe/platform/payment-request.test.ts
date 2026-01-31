import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
import { completed } from '../../../../data/stripe/stripe.webhook.checkout.session.completed'
import nock from 'nock'
import { PaymentRequestFactory, PaymentRequestCustomerFactory, PaymentRequestPaymentFactory, PaymentRequestBalanceFactory, PaymentRequestBalanceTransactionFactory } from '../../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('webhooks for payment requests', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestBalance)
  })
  describe('checkout.session.completed', () => {
    it('should make a transfer when a payment request is paid on checkout.session.completed event', async () => {
      nock('https://api.stripe.com')
        .post('/v1/transfers')
        .reply(
          200,
          {
            id: 'tr_1KkomkBrSjgsps2DGGBtipW4',
            amount: 1000,
            currency: 'usd',
            destination: 'acct_1KkomkBrSjgsps2DGGGtipW4',
            status: 'paid',
            transfer_group: 'group_1KkomkBrSjgsps2DGGBtipW4',
            created: 1633036800,
            livemode: false,
            metadata: {
              payment_link_id: 'plink_1KknpoBrSjgsps2DMwiQEzJ9',
              user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
            }
          },
          {
            'Content-Type': 'application/json'
          }
        )

      nock('https://api.stripe.com')
        .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
        .reply(200, {
          active: false
        })

      nock('https://api.stripe.com')
        .post('/v1/payment_intents/pi_3RcoMHBrSjgsps2D1aOZ9Yl6')
        .reply(200, {
          id: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
          status: 'succeeded',
          metadata: {
            payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        })
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      await PaymentRequestFactory({
        title: 'Payment for services',
        amount: 1000,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        deactivate_after_payment: true,
        userId: currentUser.id
      })
      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(completed.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
      const paymentLink = await models.PaymentRequest.findOne({
        where: { payment_link_id: event.data.object.payment_link }
      })
      expect(paymentLink).to.exist
      expect(paymentLink.status).to.equal('paid')
      expect(paymentLink.amount).to.equal('1000')
      expect(paymentLink.currency).to.equal('usd')
      expect(paymentLink.userId).to.equal(currentUser.id)
      expect(paymentLink.description).to.equal('Payment for services')
      expect(paymentLink.title).to.equal('Payment for services')
      expect(paymentLink.transfer_status).to.equal('initiated')
      expect(paymentLink.transfer_id).to.equal('tr_1KkomkBrSjgsps2DGGBtipW4')
      expect(paymentLink.active).to.equal(false)
    })
    it('should not make a transfer when there is a negative balance due equal the transfer', async () => {
      nock('https://api.stripe.com')
        .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
        .reply(200, {
          active: false
        })

      nock('https://api.stripe.com')
        .post('/v1/payment_intents/pi_3RcoMHBrSjgsps2D1aOZ9Yl6')
        .reply(200, {
          id: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
          status: 'succeeded',
          metadata: {
            payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        })
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      const paymentRequest = await PaymentRequestFactory({
        title: 'Payment for services',
        amount: 1,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        deactivate_after_payment: true,
        userId: currentUser.id
      })
      const customer = await PaymentRequestCustomerFactory({
        name: 'Customer Name',
        email: 'customer@example.com',
        userId: currentUser.id,
        sourceId: 'src_12345'
      })
      await PaymentRequestPaymentFactory({
        amount: 1,
        currency: 'usd',
        source: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
        status: 'paid',
        paymentRequestId: paymentRequest.id,
        customerId: customer.id,
        userId: currentUser.id
      })
      await PaymentRequestBalanceFactory({
        userId: currentUser.id
      })
      await PaymentRequestBalanceTransactionFactory({
        paymentRequestBalanceId: 1,
        amount: -92,
        type: 'DEBIT',
        reason: 'ADJUSTMENT',
        status: 'completed'
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(completed.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')

      const currentBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(currentBalance).to.exist
      expect(currentBalance.balance).to.equal('0')

      const lastTransactionCreated = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: currentBalance.id }
      })
      const transactionCreated = lastTransactionCreated[1]
      expect(transactionCreated).to.exist
      expect(transactionCreated.amount).to.equal('92')
      expect(transactionCreated.type).to.equal('CREDIT')
      expect(transactionCreated.reason).to.equal('ADJUSTMENT')
      expect(transactionCreated.status).to.equal('completed')
    })
    it('should not make a transfer when there is a negative balance due bigger than the transfer', async () => {
      nock('https://api.stripe.com')
        .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
        .reply(200, {
          active: false
        })

      nock('https://api.stripe.com')
        .post('/v1/payment_intents/pi_3RcoMHBrSjgsps2D1aOZ9Yl6')
        .reply(200, {
          id: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
          status: 'succeeded',
          metadata: {
            payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        })
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      const paymentRequest = await PaymentRequestFactory({
        title: 'Payment for services',
        amount: 1,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        deactivate_after_payment: true,
        userId: currentUser.id
      })
      const customer = await PaymentRequestCustomerFactory({
        name: 'Customer Name',
        email: 'customer@example.com',
        userId: currentUser.id,
        sourceId: 'src_12345'
      })
      await PaymentRequestPaymentFactory({
        amount: 1,
        currency: 'usd',
        source: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
        status: 'paid',
        paymentRequestId: paymentRequest.id,
        customerId: customer.id,
        userId: currentUser.id
      })
      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id
      })
      await PaymentRequestBalanceTransactionFactory({
        paymentRequestBalanceId: paymentRequestBalance.id,
        amount: -100,
        type: 'DEBIT',
        reason: 'DISPUTE',
        status: 'completed'
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(completed.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')

      const currentBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(currentBalance).to.exist
      expect(currentBalance.balance).to.equal('-8')

      const lastTransactionCreated = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: currentBalance.id }
      })
      const transactionCreated = lastTransactionCreated[1]
      expect(transactionCreated).to.exist
      expect(transactionCreated.amount).to.equal('92')
      expect(transactionCreated.type).to.equal('CREDIT')
      expect(transactionCreated.reason).to.equal('ADJUSTMENT')
      expect(transactionCreated.status).to.equal('completed')
    })
    it('should make a partial transfer when there is a negative balance due smaller than the transfer amount', async () => {
      nock('https://api.stripe.com')
        .post('/v1/transfers')
        .reply(
          200,
          {
            id: 'tr_1KkomkBrSjgsps2DGGBtipW4',
            amount: 10000,
            currency: 'usd',
            destination: 'acct_1KkomkBrSjgsps2DGGGtipW4',
            status: 'paid',
            transfer_group: 'group_1KkomkBrSjgsps2DGGBtipW4',
            created: 1633036800,
            livemode: false,
            metadata: {
              payment_link_id: 'plink_1KknpoBrSjgsps2DMwiQEzJ9',
              user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
            }
          },
          {
            'Content-Type': 'application/json'
          }
        )

      nock('https://api.stripe.com')
        .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
        .reply(200, {
          active: false
        })

      nock('https://api.stripe.com')
        .post('/v1/payment_intents/pi_3RcoMHBrSjgsps2D1aOZ9Yl6')
        .reply(200, {
          id: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
          status: 'succeeded',
          metadata: {
            payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
            user_id: 'user_1KkomkBrSjgsps2DGGBtipW4'
          }
        })
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      const paymentRequest = await PaymentRequestFactory({
        title: 'Payment for services',
        amount: 1,
        currency: 'usd',
        description: 'Payment for services',
        payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        deactivate_after_payment: true,
        userId: currentUser.id
      })
      const customer = await PaymentRequestCustomerFactory({
        name: 'Customer Name',
        email: 'customer@example.com',
        userId: currentUser.id,
        sourceId: 'src_12345'
      })
      await PaymentRequestPaymentFactory({
        amount: 1,
        currency: 'usd',
        source: 'pi_3RcoMHBrSjgsps2D1aOZ9Yl6',
        status: 'paid',
        paymentRequestId: paymentRequest.id,
        customerId: customer.id,
        userId: currentUser.id
      })
      const paymentRequestBalance = await PaymentRequestBalanceFactory({
        userId: currentUser.id
      })

      await PaymentRequestBalanceTransactionFactory({
        paymentRequestBalanceId: paymentRequestBalance.id,
        amount: -90,
        type: 'DEBIT',
        reason: 'ADJUSTMENT',
        status: 'completed'
      })

      const res = await agent
        .post('/webhooks/stripe-platform')
        .send(completed.success)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')
      expect(event.data.object.payment_link).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')

      const currentBalance = await models.PaymentRequestBalance.findOne({
        where: { userId: currentUser.id }
      })
      expect(currentBalance).to.exist
      expect(currentBalance.balance).to.equal('0')

      const lastTransactionCreated = await models.PaymentRequestBalanceTransaction.findAll({
        where: { paymentRequestBalanceId: currentBalance.id }
      })

      const transactionCreated = lastTransactionCreated[1]

      expect(transactionCreated).to.exist
      expect(transactionCreated.amount).to.equal('90')
      expect(transactionCreated.type).to.equal('CREDIT')
      expect(transactionCreated.reason).to.equal('ADJUSTMENT')
      expect(transactionCreated.status).to.equal('completed')
    })
  })
})
