'use strict';
const assert = require('assert');
const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const api = require('../server');
const agent = request.agent(api);
const nock = require('nock');
const { registerAndLogin, truncateModels } = require('./helpers');
const models = require('../models');
const sampleProduct = require('./data/stripe/stripe.product.create')
const samplePrice = require('./data/stripe/stripe.price.create');
const samplePaymentLink = require('./data/stripe/stripe.paymentLinks.create');


describe("PaymentRequests", () => {
  beforeEach(async () => {
    await truncateModels(models.User);
    //await truncateModels(models.PaymentRequest);
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it("should create a new payment request", async () => {
    // Mock the Stripe API to return a sample product
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/products')
      .reply(200, sampleProduct.stripe.product.create.success);

    // Mock the Stripe API to return a sample price
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/prices')
      .reply(200, samplePrice.stripe.price.create);

    // Mock the Stripe API to return a new Payment Link
    nock('https://api.stripe.com')
      .persist()
      .post('/v1/payment_links')
      .reply(200, samplePaymentLink.stripe.paymentLinks.create);

    const user = await registerAndLogin(agent);
    const res = await agent
      .post('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(201)
      .send({
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.00,
        currency: 'USD'
      });
    expect(res.body).to.exist;
    expect(res.body.id).to.exist;
    expect(res.body.title).to.equal('Test Payment Request');
    expect(res.body.description).to.equal('This is a test payment request');
    expect(res.body.amount).to.equal('100');
    expect(res.body.currency).to.equal('USD');
    expect(res.body.status).to.equal('open');
    expect(res.body.transfer_status).to.equal('pending_payment');
    expect(res.body.transfer_id).to.be.null;
    expect(res.body.payment_link_id).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km');
    expect(res.body.payment_url).to.equal('https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04')
  });
  it('should list all payment requests for a user', async () => {
    const user = await registerAndLogin(agent);
    const { body, headers } = user;
    const paymentRequestSample = await models.PaymentRequest.create({
      userId: body.id,
      title: 'Sample Payment Request',
      description: 'This is a sample payment request',
      amount: 50.00,
      currency: 'USD',
      payment_link_id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
      payment_url: 'https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04',
      status: 'open'
    });
    
    const res = await agent
      .get('/payment-requests')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', headers.authorization)
      .expect(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0].title).to.equal('Sample Payment Request');
    expect(res.body[0].description).to.equal('This is a sample payment request');
    expect(res.body[0].amount).to.equal('50');
    expect(res.body[0].currency).to.equal('USD');
    expect(res.body[0].status).to.equal('open');
    expect(res.body[0].payment_link_id).to.equal('plink_1RcnYCBrSjgsps2DsAPjr1km');
    expect(res.body[0].payment_url).to.equal('https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04');
  });
});