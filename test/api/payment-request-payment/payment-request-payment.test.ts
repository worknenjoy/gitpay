import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import models from '../../../src/models'

const agent = request.agent(api) as any
const currentModels = models as any

describe('Payment Request Payment', () => {
  beforeEach(async () => {
    await truncateModels(currentModels.User)
    await truncateModels(currentModels.PaymentRequestCustomer)
    await truncateModels(currentModels.PaymentRequest)
    await truncateModels(currentModels.PaymentRequestTransfer)
    await truncateModels(currentModels.PaymentRequestPayment)
  })
  describe('GET /payment-request-payments', () => {
    it('should list a Payment Request Payment for the current user', async () => {
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      const paymentRequest = await currentModels.PaymentRequest.create({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 1000,
        currency: 'USD',
        userId: currentUser.id
      })
      const paymentRequestCustomer = await currentModels.PaymentRequestCustomer.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        sourceId: 'src_123',
        userId: currentUser.id
      })
      const paymentRequestPayment = await currentModels.PaymentRequestPayment.create({
        amount: 1000,
        currency: 'USD',
        source: 'src_123',
        status: 'completed',
        customerId: paymentRequestCustomer.id,
        userId: currentUser.id,
        paymentRequestId: paymentRequest.id
      })
      const res = await agent
        .get('/payment-request-payments')
        .set('Authorization', headers['authorization'])
        .expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body.length).to.equal(1)
      expect(res.body[0].id).to.equal(paymentRequestPayment.id)
    })
  })
  describe('POST /payment-request-payments/:id/refund', () => {
    it('should refund a Payment Request Payment and reverse transfer', async () => {
      nock('https://api.stripe.com').post('/v1/refunds').reply(200, {
        id: 're_1JHh2Y2eZvKYlo2C0V7h1b2x',
        object: 'refund',
        amount: 1000,
        currency: 'usd',
        payment_intent: 'pi_1JHh1Z2eZvKYlo2C4b5h6j7k',
        status: 'succeeded'
      })

      nock('https://api.stripe.com').post('/v1/transfers/tr_123/reversals').reply(200, {
        id: 'trr_test_4yVfO6Wo9W8e5Y',
        object: 'transfer_reversal',
        amount: 400,
        balance_transaction: 'txn_test_4yVfPqWo9W8e5Y',
        created: 1678147568,
        currency: 'usd',
        destination_payment_refund: 'pyr_test',
        metadata: {},
        source_refund: null,
        transfer: 'tr_test'
      })

      nock('https://api.stripe.com')
        .get('/v1/transfers')
        .query(true)
        .reply(200, {
          object: 'list',
          data: [
            {
              id: 'tr_123',
              object: 'transfer',
              amount: 800,
              currency: 'usd',
              transfer_group: 'payment_request_payment_1'
            }
          ],
          has_more: false,
          url: '/v1/transfers'
        })
      const user = await registerAndLogin(agent)
      const { headers, body: currentUser } = user || {}
      const paymentRequest = await currentModels.PaymentRequest.create({
        title: 'Test Payment Request',
        description: 'A test payment request',
        amount: 1000,
        currency: 'USD',
        userId: currentUser.id
      })
      const paymentRequestCustomer = await currentModels.PaymentRequestCustomer.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        sourceId: 'src_123',
        userId: currentUser.id
      })
      const paymentRequestPayment = await currentModels.PaymentRequestPayment.create({
        amount: 1000,
        currency: 'USD',
        source: 'src_123',
        status: 'paid',
        customerId: paymentRequestCustomer.id,
        userId: currentUser.id,
        paymentRequestId: paymentRequest.id
      })

      const paymentRequestTransfer = await currentModels.PaymentRequestTransfer.create({
        amount: 800,
        currency: 'USD',
        source: 'tr_123',
        status: 'created',
        transfer_id: 'tr_123',
        paymentRequestId: paymentRequest.id,
        userId: currentUser.id
      })

      const res = await agent
        .post(`/payment-request-payments/${paymentRequestPayment.id}/refund`)
        .set('Authorization', headers['authorization'])
        .expect(200)

      const refundedPayment = await currentModels.PaymentRequestPayment.findByPk(
        paymentRequestPayment.id
      )
      const refundedTransfer = await currentModels.PaymentRequestTransfer.findByPk(
        paymentRequestTransfer.id
      )
      expect(refundedPayment).to.have.property('id', paymentRequestPayment.id)
      expect(refundedPayment).to.have.property('status', 'refunded')
      expect(refundedTransfer).to.have.property('status', 'reversed')
    })
  })
})
