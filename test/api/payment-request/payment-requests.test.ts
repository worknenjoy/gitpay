import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import nock from 'nock'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import { PaymentRequestFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

const sampleProduct = require('../../data/stripe/stripe.product.create')
const samplePrice = require('../../data/stripe/stripe.price.create')
const samplePaymentLink = require('../../data/stripe/stripe.paymentLinks.create')

describe('POST /payment-request', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequest)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it('should create a new payment request', async () => {
    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: 'email content'
        }
      ])

    // Mock the Stripe API to return a sample product
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products')
      .reply(200, sampleProduct.stripe.product.create.success)

    // Mock the Stripe API to return a sample price
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/prices')
      .reply(200, samplePrice.stripe.price.create)

    // Mock the Stripe API to return a new Payment Link
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create)

    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
      .reply(200, {})

    const user = await registerAndLogin(agent)

    const res = await agent
      .post('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(201)
      .send({
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD'
      })

    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.title).to.equal('Test Payment Request')
    expect(res.body.description).to.equal('This is a test payment request')
    expect(res.body.amount).to.equal('100')
    expect(res.body.currency).to.equal('USD')
    expect(res.body.send_instructions_email).to.equal(false)
    expect(res.body.instructions_content).to.equal(null)
    expect(res.body.status).to.equal('open')
    expect(res.body.transfer_status).to.equal('pending_payment')
    expect(res.body.transfer_id).to.be.null
    expect(res.body.payment_link_id).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
    expect(res.body.payment_url).to.equal('https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04')
  })
  it('should create a new payment request with email instructions', async () => {
    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: 'email content'
        }
      ])

    // Mock the Stripe API to return a sample product
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products')
      .reply(200, sampleProduct.stripe.product.create.success)

    // Mock the Stripe API to return a sample price
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/prices')
      .reply(200, samplePrice.stripe.price.create)

    // Mock the Stripe API to return a new Payment Link
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create)

    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
      .reply(200, {})

    const user = await registerAndLogin(agent)

    const res = await agent
      .post('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(201)
      .send({
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.0,
        currency: 'USD',
        send_instructions_email: true,
        instructions_content: 'Please follow the instructions to complete the payment.'
      })

    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.title).to.equal('Test Payment Request')
    expect(res.body.description).to.equal('This is a test payment request')
    expect(res.body.amount).to.equal('100')
    expect(res.body.currency).to.equal('USD')
    expect(res.body.send_instructions_email).to.equal(true)
    expect(res.body.instructions_content).to.equal(
      'Please follow the instructions to complete the payment.'
    )
    expect(res.body.status).to.equal('open')
    expect(res.body.transfer_status).to.equal('pending_payment')
    expect(res.body.transfer_id).to.be.null
    expect(res.body.payment_link_id).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
    expect(res.body.payment_url).to.equal('https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04')
  })

  it('should create a new payment request with custom amount', async () => {
    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: 'email content'
        }
      ])
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products')
      .reply(200, sampleProduct.stripe.product.create.success)
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/prices')
      .reply(200, samplePrice.stripe.price.create)
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create)
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
      .reply(200, {})
    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(201)
      .send({
        title: 'Test Payment Request with Custom Amount',
        description: 'This is a test payment request with custom amount',
        amount: 0.0,
        currency: 'USD',
        custom_amount: true
      })
  })

  it('should list all payment requests for a user', async () => {
    const register = await registerAndLogin(agent)
    const { body, headers } = register

    await PaymentRequestFactory({
      userId: body.id,
      title: 'Sample Payment Request',
      custom_amount: true,
      amount: null,
      description: 'This is a sample payment request',
      currency: 'USD',
      payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
      payment_url: 'https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04',
      status: 'open'
    })

    const res = await agent
      .get('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', headers.authorization)
      .expect(200)
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.be.greaterThan(0)
    expect(res.body[0].title).to.equal('Sample Payment Request')
    expect(res.body[0].description).to.equal('This is a sample payment request')
    expect(res.body[0].amount).to.equal(null)
    expect(res.body[0].custom_amount).to.equal(true)
    expect(res.body[0].currency).to.equal('USD')
    expect(res.body[0].status).to.equal('open')
    expect(res.body[0].payment_link_id).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km')
    expect(res.body[0].payment_url).to.equal('https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04')
    expect(res.body[0].deactivate_after_payment).to.equal(false)
  })

  it('should update a payment request', async () => {
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create)

    nock('https://api.stripe.com')
      .persist()
      .get('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km/line_items?limit=1')
      .reply(200, {
        data: [
          {
            price: {
              id: 'prc_1RcnYMBrSjgsps2D4k1eX2qK',
              product: 'prod_1RcnYBBrSjgsps2D5oQd3q3V'
            }
          }
        ]
      })

    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products/prod_1RcnYBBrSjgsps2D5oQd3q3V')
      .reply(200, {
        data: [
          {
            ...sampleProduct.stripe.product.create.success,
            name: 'New Title',
            description: 'New Description'
          }
        ]
      })

    const register = await registerAndLogin(agent)
    const { body, headers } = register

    const paymentRequest = await PaymentRequestFactory({
      userId: body.id,
      title: 'Old Title',
      description: 'Old Description',
      currency: 'USD',
      amount: 50,
      payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
      payment_url: 'https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04',
      status: 'open',
      active: true
    })

    const res = await agent
      .put(`/payment-requests/${paymentRequest.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', headers.authorization)
      .expect(200)
      .send({
        active: false,
        title: 'New Title',
        description: 'New Description'
      })
    expect(res.body).to.exist
    expect(res.body.id).to.equal(paymentRequest.id)
    expect(res.body.active).to.equal(false)
    expect(res.body.amount).to.equal('50')
    expect(res.body.title).to.equal('New Title')
    expect(res.body.description).to.equal('New Description')
  })
  it('should update a payment request with email instructions', async () => {
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create)

    nock('https://api.stripe.com')
      .persist()
      .get('/v1/payment_links/plink_1RcnYCBrSjgsps2DsAPjr1km/line_items?limit=1')
      .reply(200, {
        data: [
          {
            price: {
              id: 'prc_1RcnYMBrSjgsps2D4k1eX2qK',
              product: 'prod_1RcnYBBrSjgsps2D5oQd3q3V'
            }
          }
        ]
      })

    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products/prod_1RcnYBBrSjgsps2D5oQd3q3V')
      .reply(200, {
        data: [
          {
            ...sampleProduct.stripe.product.create.success,
            name: 'New Title',
            description: 'New Description'
          }
        ]
      })

    const register = await registerAndLogin(agent)
    const { body, headers } = register

    const paymentRequest = await PaymentRequestFactory({
      userId: body.id,
      title: 'Old Title',
      description: 'Old Description',
      currency: 'USD',
      amount: 50,
      payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
      payment_url: 'https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04',
      status: 'open',
      active: true
    })

    const res = await agent
      .put(`/payment-requests/${paymentRequest.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', headers.authorization)
      .expect(200)
      .send({
        active: false,
        title: 'New Title',
        description: 'New Description',
        send_instructions_email: true,
        instructions_content: 'Please follow the instructions to complete the payment.'
      })
    expect(res.body).to.exist
    expect(res.body.id).to.equal(paymentRequest.id)
    expect(res.body.active).to.equal(false)
    expect(res.body.amount).to.equal('50')
    expect(res.body.title).to.equal('New Title')
    expect(res.body.description).to.equal('New Description')
    expect(res.body.send_instructions_email).to.equal(true)
    expect(res.body.instructions_content).to.equal(
      'Please follow the instructions to complete the payment.'
    )
  })
})
