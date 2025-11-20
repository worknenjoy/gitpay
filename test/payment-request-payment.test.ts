import { expect } from 'chai'
import request from 'supertest'
import api from '../src/server'
import { registerAndLogin, truncateModels } from './helpers'
import models from '../src/models'

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
