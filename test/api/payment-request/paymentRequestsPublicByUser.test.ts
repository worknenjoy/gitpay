import { expect } from 'chai'
import request from 'supertest'
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
    await truncateModels(models.PaymentRequestPayment)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.User)
  })

  it('returns only active payment requests for the user, with a computed paidCount', async () => {
    const user = await UserFactory()
    const paymentRequest = await PaymentRequestFactory({
      userId: user.id,
      active: true,
      listed_on_profile: true,
      title: 'Code review session',
      description: 'A focused walkthrough',
      amount: 12000,
      currency: 'usd',
      payment_url: 'https://gitpay.me/p/code-review'
    })
    const customer = await PaymentRequestCustomerFactory({ userId: user.id })
    await PaymentRequestPaymentFactory({
      paymentRequestId: paymentRequest.id,
      customerId: customer.id,
      userId: user.id,
      source: 'stripe',
      status: 'paid'
    })
    await PaymentRequestPaymentFactory({
      paymentRequestId: paymentRequest.id,
      customerId: customer.id,
      userId: user.id,
      source: 'stripe',
      status: 'succeeded'
    })
    await PaymentRequestPaymentFactory({
      paymentRequestId: paymentRequest.id,
      customerId: customer.id,
      userId: user.id,
      source: 'stripe',
      status: 'failed'
    })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.have.lengthOf(1)
    const [link] = res.body
    expect(link.id).to.equal(paymentRequest.id)
    expect(link.title).to.equal('Code review session')
    expect(link.description).to.equal('A focused walkthrough')
    expect(link.url).to.equal('https://gitpay.me/p/code-review')
    expect(link.price).to.equal(12000)
    expect(link.currency).to.equal('usd')
    expect(link.paidCount).to.equal(2)
    expect(link.userId).to.be.undefined
    expect(link.payment_url).to.be.undefined
    expect(link.amount).to.be.undefined
  })

  it('excludes inactive payment requests', async () => {
    const user = await UserFactory()
    await PaymentRequestFactory({ userId: user.id, active: false, listed_on_profile: true })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('excludes payment requests not listed on profile', async () => {
    const user = await UserFactory()
    await PaymentRequestFactory({ userId: user.id, active: true, listed_on_profile: false })

    const res = await agent.get(`/payment-requests-public/user/${user.id}`).expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('does not return another user\'s payment requests', async () => {
    const owner = await UserFactory()
    const other = await UserFactory()
    await PaymentRequestFactory({ userId: owner.id, active: true, listed_on_profile: true })

    const res = await agent.get(`/payment-requests-public/user/${other.id}`).expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('400s for a non-numeric userId', async () => {
    await agent.get('/payment-requests-public/user/not-a-number').expect(400)
  })
})
