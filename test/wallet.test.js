const expect = require('chai').expect
const request = require('supertest')
const api = require('../src/server').default
const agent = request.agent(api)
const models = require('../src/models')
const { truncateModels, registerAndLogin } = require('./helpers')
const { head } = require('request')

describe('Wallet', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Wallet)
  })

  it('should create an initial wallet with no balance', async () => {
    const user = await registerAndLogin(agent)
    const res = await agent
      .post('/wallets')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(201)
      .send({
        name: 'Test Wallet',
      })
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Test Wallet')
    expect(res.body.balance).to.equal('0.00')
  })
  it('should update wallet balance', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await models.Wallet.create({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0,
    })
    const res = await agent
      .put(`/wallets/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(200)
      .send({
        amount: 100,
      })
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Test Wallet')
    expect(res.body.balance).to.equal('100.00')
  })
  it('should list wallets', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await models.Wallet.create({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0,
    })
    const res = await agent
      .get('/wallets')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(200)
    expect(res.body).to.exist
    expect(res.body[0].id).to.exist
    expect(res.body[0].name).to.equal('Test Wallet')
    expect(res.body[0].balance).to.equal('0.00')
  })
  it('should fetch wallet', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await models.Wallet.create({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0,
    })
    const res = await agent
      .get(`/wallets/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(200)
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Test Wallet')
    expect(res.body.balance).to.equal('0.00')
  })
})
