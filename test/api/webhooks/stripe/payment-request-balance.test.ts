import { expect } from 'chai'
import nock from "nock";
import request from 'supertest';
import api from '../../../../src/server';
import { registerAndLogin, truncateModels } from '../../../helpers';
import Models from '../../../../src/models';
import { disputeClosed } from '../../../data/stripe/stripe.webhook.charge.dispute.closed';

const agent = request.agent(api) as any;
const models = (Models as any);


describe('Payment Request Balance Webhook', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.PaymentRequestBalance)
    await truncateModels(models.PaymentRequestBalanceTransaction)
  })
  it('should create a Payment Request Balance with two transactions for a user when a charge.dispute.closed event is received', async () => {

    nock('https://api.stripe.com')
      .get('/v1/disputes/du_test_123')
      .reply(200, {
        created: 123,
      });

    const user = await registerAndLogin(agent)
    const { headers, body: currentUser } = user || {};

    const paymentRequest = await models.PaymentRequest.create({
      title: 'Test Payment Request',
      description: 'A test payment request',
      amount: 5000,
      currency: 'usd',
      userId: currentUser.id
    });

    const paymentRequestCustomer = await models.PaymentRequestCustomer.create({
      email: 'test@example.com',
      name: 'Test User',
      sourceId: 'src_test_123',
      userId: currentUser.id
    });

    const paymentRequestPayment = await models.PaymentRequestPayment.create({
      amount: 5000,
      currency: 'usd',
      source: 'pi_test_123',
      status: 'paid',
      customerId: paymentRequestCustomer.id,
      paymentRequestId: paymentRequest.id,
      userId: currentUser.id
    });
    
    const res = await agent
      .post('/webhooks/stripe-platform')
      .send(disputeClosed)
      .expect('Content-Type', /json/)
      .expect(200)

    const event = JSON.parse(Buffer.from(res.body).toString())
      expect(event).to.exist
      expect(event.id).to.equal('evt_test_dispute_closed_1')

    const paymentRequestBalance = await models.PaymentRequestBalance.findOne({
      where: {
        userId: currentUser.id
      }
    });

    const paymentRequestBalanceTransaction = await models.PaymentRequestBalanceTransaction.findOne({
      where: {
        paymentRequestBalanceId: paymentRequestBalance.id,
      }
    });

    expect(paymentRequestBalanceTransaction).to.exist;
    expect(paymentRequestBalanceTransaction.amount).to.equal('-6495');
    expect(paymentRequestBalanceTransaction.type).to.equal('DEBIT');
    expect(paymentRequestBalanceTransaction.reason).to.equal('DISPUTE');
    expect(paymentRequestBalanceTransaction.status).to.equal('lost');
    expect(paymentRequestBalanceTransaction.openedAt).to.be.instanceOf(Date);
    expect(paymentRequestBalanceTransaction.closedAt).to.be.instanceOf(Date);

    expect(paymentRequestBalance).to.exist;
    expect(paymentRequestBalance.balance).to.equal('-6495');
    
  });
});