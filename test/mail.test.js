
const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { register, createTask, truncateModels } = require('./helpers');
const TransferMail = require('../modules/mail/transfer');
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

  xit('should send transfer initiated email', async () => {

    nock('https://api.sendgrid.com')
      .persist()
      .post('/v3/mail/send')
      .reply(202, [
        {
          type: 'text/html',
          value: '\n' +
            ' <!-- START MAIN CONTENT AREA -->\n' +
            '              <tr>\n' +
            '                <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">\n' +
            '                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">\n' +
            '          <p>A payment request was initiated for your Payment request.<br/><br/><strong>Title:</strong> Test Payment Request<br/><strong>Description:</strong> This is a test payment request<br/><strong>Requested Amount:</strong>100 USD<br/><strong>Payment Link:</strong> <a href="">Pay here</a><br/><br/>After processing fees, the final transfer amount will be <strong>92 USD</strong>.</p></p>\n' +
            '                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;"></p>\n' +
            '                </td>\n' +
            '              </tr>\n' +
            '\n' +
            '              <!-- END MAIN CONTENT AREA -->\n'
        }
      ]);

    const user = await register(agent);
    const { body } = user;

    TransferMail.paymentRequestInitiated(
      body,
      {
        title: 'Test Payment Request',
        description: 'This is a test payment request',
        amount: 100.00,
        paymentUrl: 'https://example.com/payment-link',
        transfer_amount: 92.00,
      },
      92.00
    );
    expect(mailResponse.statusCode).to.equal(202);
  });
});