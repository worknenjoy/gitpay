import { expect } from 'chai'
import request from 'supertest'
import api from '../../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
import { createdFromPaymentRequest } from '../../../../data/stripe/stripe.transfer.created'

const agent = request.agent(api) as any
const models = Models as any

describe('webhooks for payment request transfers', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
  })
  it('should create the payment request transfer when a event transfer.created is received', async () => {
    const user = await registerAndLogin(agent)
    const { headers, body: currentUser } = user || {}
    const paymentRequest = await models.PaymentRequest.create({
      title: 'Payment for services',
      amount: 1000,
      currency: 'usd',
      description: 'Payment for services',
      userId: currentUser.id,
      transfer_status: 'pending',
    })

    const res = await agent
      .post('/webhooks/stripe-platform')
      .send(createdFromPaymentRequest)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(res.statusCode).to.equal(200)
    const event = res.body
    expect(event).to.exist
    expect(event.id).to.equal('evt_test_456')
    const transfer = await models.PaymentRequestTransfer.findOne({
      where: { paymentRequestId: paymentRequest.id },
      include: [models.PaymentRequest],
    })
    expect(transfer).to.exist
    expect(transfer.id).to.equal(1)
    expect(transfer.transfer_id).to.equal('tr_test_456')
    expect(transfer.value).to.equal('10')
    expect(transfer.status).to.equal('created')
    expect(transfer.PaymentRequest.id).to.equal(paymentRequest.id)
    expect(transfer.PaymentRequest.title).to.equal('Payment for services')
    expect(transfer.PaymentRequest.amount).to.equal('1000')
    expect(transfer.PaymentRequest.currency).to.equal('usd')
    expect(transfer.PaymentRequest.description).to.equal('Payment for services')
  })
})
