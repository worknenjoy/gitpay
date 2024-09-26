const expect = require('chai').expect
const request = require('supertest')
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { truncateModels, registerAndLogin } = require('./helpers')
const exp = require('constants')

describe('WalletOrder', () => {

  beforeEach(async () => {
    await truncateModels(models.User);
    await truncateModels(models.Wallet);
  });

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
        amount: 100,
        status: 'pending'
      });
    expect(res.body).to.exist;
    expect(res.body.id).to.exist;
    expect(res.body.amount).to.equal('100');
    expect(res.body.status).to.equal('pending');
    expect(res.body.walletId).to.equal(wallet.id);

    const walletUpdated = await models.Wallet.findOne({
      where: {
        id: wallet.id
      }
    });

    expect(walletUpdated.balance).to.equal('0.00');
  })
  it('should create an initial wallet Order with balance updated when order is succeeded', async () => {
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
        amount: 100,
        status: 'succeeded'
      });
    expect(res.body).to.exist;
    expect(res.body.id).to.exist;
    expect(res.body.amount).to.equal('100');
    expect(res.body.status).to.equal('succeeded');
    expect(res.body.walletId).to.equal(wallet.id);

    const walletUpdated = await models.Wallet.findOne({
      where: {
        id: wallet.id
      }
    });

    expect(walletUpdated.balance).to.equal('0.00');
  })
  xit('should update wallet order', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await models.Wallet.create({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0
    });
    const res = await agent
      .put(`/wallets/orders/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(200)
      .send({
        amount: 100
      });
    expect(res.body).to.exist;
    expect(res.body.id).to.exist;
    expect(res.body.name).to.equal('Test Wallet');
    expect(res.body.balance).to.equal('100.00');
  });
})