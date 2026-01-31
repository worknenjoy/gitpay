import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../../../src/server'
import { registerAndLogin, truncateModels } from '../../../../helpers'
import Models from '../../../../../src/models'
import eventCheckout from '../../../../data/stripe/stripe.webhook.checkout.session.completed'
import { PaymentRequestFactory } from '../../../../factories'

const agent = request.agent(api) as any
const models = Models as any

describe('Payment Request Payment Webhook', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequestCustomer)
    await truncateModels(models.PaymentRequest)
    await truncateModels(models.PaymentRequestTransfer)
    await truncateModels(models.PaymentRequestPayment)
  })
  it('should create a Payment Request Payment when a checkout.session.completed event is received', async () => {
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
        object: 'payment_intent',
        metadata: {
          payment_request_payment_id: 1
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
    const res = await agent
      .post('/webhooks/stripe-platform')
      .send(eventCheckout.completed.success)
      .expect('Content-Type', /json/)
      .expect(200)

    const event = JSON.parse(Buffer.from(res.body).toString())
    expect(event).to.exist
    expect(event.id).to.equal('evt_1Q2fklBrSjgsps2Dx0mEXsXv')

    const paymentRequestPayments = await models.PaymentRequestPayment.findOne({
      where: {
        source: event.data.object.payment_intent
      }
    })
    expect(paymentRequestPayments).to.exist
    expect(paymentRequestPayments.amount).to.equal('1')
    expect(paymentRequestPayments.currency).to.equal('usd')
    expect(paymentRequestPayments.status).to.equal('paid')
    expect(paymentRequestPayments.userId).to.equal(currentUser.id)
    expect(paymentRequestPayments.paymentRequestId).to.equal(paymentRequest.id)
    expect(paymentRequestPayments.customerId).to.exist
  })
})
