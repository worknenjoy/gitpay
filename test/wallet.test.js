const expect = require('chai').expect
const request = require('supertest')
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { truncateModels } = require('./helpers')

describe('Wallet', () => {

  beforeEach(async () => {
    await truncateModels(models.User);
    await truncateModels(models.Wallet);
  });

  it('should create an initial wallet with no balance', async () => {
    const user = await models.User.create({
      email: 'test@gmail.com',
    });
    const res = await agent
      .post('/wallets')
      .expect(201)
      .send({
        userId: user.dataValues.id,
        name: 'Test Wallet'
      });
    console.log('response', res.statusCode)
    expect(res.body).to.exist;
    expect(res.body.id).to.exist;
    expect(res.body.name).to.equal('Test Wallet');
    expect(res.body.balance).to.equal(0);
  });
})