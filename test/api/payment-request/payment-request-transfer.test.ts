import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { PaymentRequestFactory, PaymentRequestTransferFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

describe('POST /payment-request-transfer', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
  })

  describe('List Payment Request Transfers', () => {
    it('should list payment request transfers for a user', async () => {
      const user = await registerAndLogin(agent)
      const { headers } = user
      const res = await agent
        .get(`/payment-request-transfers`)
        .set('Authorization', headers.authorization)
      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body).to.be.an('array')
    })
  })

  // Transfers are created and updated only by the platform (payment flow and webhooks)
  describe('Create and update Payment Request Transfer', () => {
    it('should not expose create or update endpoints to users', async () => {
      const user = await registerAndLogin(agent)
      const { headers, body } = user
      const paymentRequest = await PaymentRequestFactory({
        userId: body.id,
        title: 'Test Payment Request',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_123'
      })
      const transfer = await PaymentRequestTransferFactory({
        userId: body.id,
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_123',
        transfer_method: 'stripe'
      })

      await agent
        .post('/payment-request-transfers')
        .set('Authorization', headers.authorization)
        .send({ paymentRequestId: paymentRequest.id, status: 'paid', value: 1000 })
        .expect(404)
      await agent
        .put(`/payment-request-transfers/${transfer.id}`)
        .set('Authorization', headers.authorization)
        .send({ status: 'completed', value: 1000 })
        .expect(404)

      await transfer.reload()
      expect(transfer.status).to.equal('pending')
      expect(await models.PaymentRequestTransfer.count()).to.equal(1)
    })
  })
})
