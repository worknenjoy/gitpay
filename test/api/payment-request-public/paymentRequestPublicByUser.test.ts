import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import {
  UserFactory,
  PaymentRequestFactory,
  PaymentRequestPaymentFactory,
  PaymentRequestCustomerFactory
} from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /payment-requests-public/user/:userId', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequest)
  })

  it('should return only public-safe fields for a user\'s active payment requests', async () => {
    const user = await UserFactory()
    const paymentRequest = await PaymentRequestFactory({
      userId: user.id,
      active: true,
      title: 'Code review',
      description: 'One hour deep dive',
      currency: 'usd',
      amount: 12000,
      payment_link_id: 'plink_secret_123',
      payment_url: 'http://localhost:8082/#/payment-requests/1/pay',
      tier: 'Standard',
      featured: true
    })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.be.an('array').with.length(1)
    expect(res.body[0]).to.deep.equal({
      id: paymentRequest.id,
      title: 'Code review',
      description: 'One hour deep dive',
      currency: 'usd',
      provider: paymentRequest.provider,
      custom_amount: false,
      amount: '12000',
      payment_url: 'http://localhost:8082/#/payment-requests/1/pay',
      tier: 'Standard',
      featured: true,
      paidCount: 0
    })
    expect(res.body[0].payment_link_id).to.be.undefined
    expect(res.body[0].userId).to.be.undefined
  })

  it('should exclude inactive payment requests', async () => {
    const user = await UserFactory()
    await PaymentRequestFactory({ userId: user.id, active: false })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.be.an('array').with.length(0)
  })

  it('should include a batched paid count per payment request', async () => {
    const user = await UserFactory()
    const paymentRequest = await PaymentRequestFactory({ userId: user.id, active: true })
    const customer = await PaymentRequestCustomerFactory({ userId: user.id })

    await PaymentRequestPaymentFactory({
      status: 'succeeded',
      source: 'pay_1',
      customerId: customer.id,
      paymentRequestId: paymentRequest.id,
      userId: user.id
    })
    await PaymentRequestPaymentFactory({
      status: 'paid',
      source: 'pay_2',
      customerId: customer.id,
      paymentRequestId: paymentRequest.id,
      userId: user.id
    })
    await PaymentRequestPaymentFactory({
      status: 'refunded',
      source: 'pay_3',
      customerId: customer.id,
      paymentRequestId: paymentRequest.id,
      userId: user.id
    })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body[0].paidCount).to.equal(2)
  })

  it('should not return payment requests from another user', async () => {
    const user = await UserFactory()
    const otherUser = await UserFactory()
    await PaymentRequestFactory({ userId: otherUser.id, active: true })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.be.an('array').with.length(0)
  })
})
