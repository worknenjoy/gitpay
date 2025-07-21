
const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { register, createTask, truncateModels } = require('./helpers');
const PaymentRequestMail = require('../modules/mail/paymentRequest');
const sinon = require('sinon');
const constants = require('../modules/mail/constants');
const { sendgrid } = require('../config/secrets')
const nock = require('nock');

describe('Mail', () => {
  before(() => {
    sinon.stub(constants, 'canSendEmail').get(() => true);
    sinon.stub(sendgrid, 'apiKey').get(() => 'SG.TEST_API_KEY');
  });

  after(() => {
    sinon.restore();
  });

  beforeEach(async () => {
    await truncateModels(models.User);
  });

  it('should send transfer initiated email', async () => {

    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: 'email content'
        }
      ]);

    const user = await register(agent);
    const { body } = user;

    const mailResponse = await PaymentRequestMail.paymentRequestInitiated(
      body,
      {
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        currency: 'USD',
        amount: 100.00,
        paymentUrl: 'https://example.com/payment-link',
      }
    );
    expect(mailResponse[0].statusCode).to.equal(202);
  });
});