const expect = require('chai').expect
const request = require('supertest')
const nock = require('nock')
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { truncateModels, registerAndLogin } = require('./helpers')
const invoiceBasic = require('./data/stripe.invoice.basic')
const invoiceItem = require('./data/stripe.invoiceitem')

describe('WalletOrder', () => {

  beforeEach(async () => {
    await truncateModels(models.User);
    await truncateModels(models.Wallet);
    await truncateModels(models.WalletOrder);
  });
  describe('creating wallet order', () => {
    beforeEach(() => {
      nock('https://api.stripe.com')
        .post('/v1/invoices')
        .reply(200, invoiceBasic.created, {
          'Content-Type': 'application/json',
        })
    nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, invoiceItem.created, {
        'Content-Type': 'application/json',
      })

    nock('https://api.stripe.com')
      .post('/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj/finalize')
      .reply(200, invoiceBasic.created, {
        'Content-Type': 'application/json',
      })
    })
    it('should create an initial wallet Order', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      });
      const res = await agent
        .post('/wallets/orders')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(201)
        .send({
          walletId: wallet.id,
          amount: 100
        });
      expect(res.body).to.exist;
      expect(res.body.id).to.exist;
      expect(res.body.amount).to.equal('100');
      expect(res.body.status).to.equal('open');
      expect(res.body.walletId).to.equal(wallet.id);

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      });

      expect(walletUpdated.balance).to.equal('0.00');
    })
  })
  describe('updating wallet order', () => {
    beforeEach(() => {
      nock('https://api.stripe.com')
        .post('/v1/invoices')
        .reply(200, invoiceBasic.created, {
          'Content-Type': 'application/json',
        })
    nock('https://api.stripe.com')
      .post('/v1/invoiceitems')
      .reply(200, invoiceItem.created, {
        'Content-Type': 'application/json',
      })

    nock('https://api.stripe.com')
      .post('/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj/finalize')
      .reply(200, invoiceBasic.updated, {
        'Content-Type': 'application/json',
      })
    })
    it('should update an initial wallet Order with balance updated when order is paid', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      });
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      });
      const res = await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        });

      expect(res.body).to.exist;
      expect(res.body.id).to.exist;
      expect(res.body.amount).to.equal('100');
      expect(res.body.status).to.equal('paid');
      expect(res.body.walletId).to.equal(wallet.id);

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      });

      expect(walletUpdated.balance).to.equal('100.00');
    })
    it('should create many wallet Orders with balance updated when order is succeeded', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      });
      
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      });
      await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        });

      const walletOrder2 = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      });
      await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        });

      const walletOrder3 = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100
      });
      await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'open'
        });

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      });

      expect(walletUpdated.balance).to.equal('200.00');
    })
    it('should update wallet order', async () => {
      const user = await registerAndLogin(agent)
      const wallet = await models.Wallet.create({
        userId: user.body.id,
        name: 'Test Wallet',
        balance: 0
      });
      const walletOrder = await models.WalletOrder.create({
        walletId: wallet.id,
        amount: 100,
        status: 'pending'
      });
      const res = await agent
        .put(`/wallets/orders/${walletOrder.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', user.headers.authorization)
        .expect(200)
        .send({
          status: 'paid'
        });
      expect(res.body).to.exist;
      expect(res.body.id).to.exist;
      expect(res.body.status).to.equal('paid');

      const walletUpdated = await models.Wallet.findOne({
        where: {
          id: wallet.id
        }
      });

      expect(walletUpdated.balance).to.equal('100.00');
    });
  })
})