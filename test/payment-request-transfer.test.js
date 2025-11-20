'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../src/server').default
const agent = request.agent(api)
const nock = require('nock')
const { registerAndLogin, truncateModels } = require('./helpers')
const models = require('../src/models')

describe('Payment Request Transfer', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
  })
  describe('Create basic Payment Request Transfer', () => {
    it('should create a basic payment request transfer', async () => {
      const user = await registerAndLogin(agent)
      const { headers, body } = user
      const paymentRequest = await models.PaymentRequest.create({
        userId: body.id,
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_123',
      })
      const transferData = {
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_123',
        transfer_method: 'stripe',
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
      const paymentRequest = await models.PaymentRequest.create({
        userId: body.id,
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD',
        payment_link_id: 'prl_123',
      })
      const transferData = {
        userId: body.id,
        paymentRequestId: paymentRequest.id,
        status: 'pending',
        value: 100.0,
        transfer_id: 'tr_123',
        transfer_method: 'stripe',
      }
      const transfer = await models.PaymentRequestTransfer.create(transferData)
      const updatedTransferData = {
        status: 'completed',
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
  })
})
