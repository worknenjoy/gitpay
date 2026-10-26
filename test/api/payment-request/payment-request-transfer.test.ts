import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import {
  TransferFactory,
  PaymentRequestFactory,
  PaymentRequestTransferFactory
} from '../../factories'

const agent = request.agent(api)
const models = Models as any

describe('POST /payment-request-transfer', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
  })
  describe('Create basic Payment Request Transfer', () => {
    it('should create a basic payment request transfer', async () => {
      const user = await registerAndLogin(agent)
      const { headers, body } = user
      const paymentRequest = await PaymentRequestFactory({
        userId: body.id,
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_123'
      })
      const transferData = {
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_123',
        transfer_method: 'stripe'
      }
      const res = await agent
        .post('/payment-request-transfers')
        .set('authorization', headers.authorization)
        .send(transferData)
      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.paymentRequestId).to.equal(transferData.paymentRequestId)
      expect(res.body.userId).to.equal(body.id)
      expect(res.body.status).to.equal(transferData.status)
      expect(res.body.value).to.equal(`${transferData.value}`)
      expect(res.body.transfer_id).to.equal(transferData.transfer_id)
      expect(res.body.transfer_method).to.equal(transferData.transfer_method)
    })
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

  describe('Update Payment Request Transfer', () => {
    it('should update a payment request transfer', async () => {
      const user = await registerAndLogin(agent)
      const { headers, body } = user
      const paymentRequest = await PaymentRequestFactory({
        userId: body.id,
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_123'
      })
      const transferData = {
        userId: body.id,
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_123',
        transfer_method: 'stripe'
      }
      const transfer = await PaymentRequestTransferFactory(transferData)
      const updatedTransferData = {
        status: 'completed'
      }
      const res = await agent
        .put(`/payment-request-transfers/${transfer.id}`)
        .set('Authorization', headers.authorization)
        .send(updatedTransferData)

      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.id).to.equal(transfer.id)
      expect(res.body.status).to.equal(updatedTransferData.status)
    })

    it('should return 403 when trying to update another user payment request transfer', async () => {
      const user1 = await registerAndLogin(agent)
      const user2 = await registerAndLogin(agent, {
        email: 'attacker@example.com',
        password: 'attackerpassword'
      })

      const paymentRequest = await PaymentRequestFactory({
        userId: user1.body.id,
        title: 'Original Payment Request',
        description: 'Original description',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_victim_1'
      })

      const transfer = await PaymentRequestTransferFactory({
        userId: user1.body.id,
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_victim_1',
        transfer_method: 'stripe'
      })

      const res = await agent
        .put(`/payment-request-transfers/${transfer.id}`)
        .set('Authorization', user2.headers.authorization)
        .send({
          status: 'completed'
        })

      expect(res.status).to.equal(403)

      const unchanged = await models.PaymentRequestTransfer.findByPk(transfer.id)
      expect(unchanged.userId).to.equal(user1.body.id)
      expect(unchanged.status).to.equal('pending')
    })

    it('should not allow user to override userId on creation', async () => {
      const user = await registerAndLogin(agent)
      const paymentRequest = await PaymentRequestFactory({
        userId: user.body.id,
        title: 'Test Payment Request',
        description: 'Description',
        amount: 50.0,
        currency: 'USD',
        payment_link_id: 'prl_victim_2'
      })

      const res = await agent
        .post('/payment-request-transfers')
        .set('authorization', user.headers.authorization)
        .send({
          paymentRequestId: paymentRequest.id,
          status: 'pending',
          value: 50.0,
          transfer_id: 'tr_2',
          transfer_method: 'stripe',
          userId: 99999
        })

      expect(res.status).to.equal(200)
      expect(res.body.userId).to.equal(user.body.id)
    })

    it('should ignore attempts to reassign userId during update', async () => {
      const user = await registerAndLogin(agent)
      const paymentRequest = await PaymentRequestFactory({
        userId: user.body.id,
        title: 'Test Payment Request',
        description: 'Description',
        amount: 75.0,
        currency: 'USD',
        payment_link_id: 'prl_victim_3'
      })

      const transfer = await PaymentRequestTransferFactory({
        userId: user.body.id,
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 75.0,
        transfer_id: 'tr_3',
        transfer_method: 'stripe'
      })

      const res = await agent
        .put(`/payment-request-transfers/${transfer.id}`)
        .set('Authorization', user.headers.authorization)
        .send({
          status: 'completed',
          userId: 99999
        })

      expect(res.status).to.equal(200)
      expect(res.body.userId).to.equal(user.body.id)

      const reloaded = await models.PaymentRequestTransfer.findByPk(transfer.id)
      expect(reloaded.userId).to.equal(user.body.id)
      expect(reloaded.status).to.equal('completed')
    })
  })
})

