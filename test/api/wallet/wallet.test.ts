import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels, registerAndLogin } from '../../helpers'
import { WalletFactory } from '../../factories'

const agent = request.agent(api)
const models = Models as any

describe('POST /wallet', () => {
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
        name: 'Test Wallet'
      })
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Test Wallet')
    expect(res.body.balance).to.equal('0.00')
  })
  it('should update wallet balance', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await WalletFactory({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0
    })
    const res = await agent
      .put(`/wallets/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(200)
      .send({
        amount: 100
      })
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Test Wallet')
    expect(res.body.balance).to.equal('100.00')
  })
  it('should list wallets', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await WalletFactory({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0
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
    const wallet = await WalletFactory({
      userId: user.body.id,
      name: 'Test Wallet',
      balance: 0
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
  it('should not update wallet belonging to another user (returns 404)', async () => {
    const owner = await registerAndLogin(agent, { email: 'owner_wallet_1622@gitpay.me' })
    const wallet = await WalletFactory({
      userId: owner.body.id,
      name: 'Owner Wallet',
      balance: 0
    })

    const attacker = await registerAndLogin(agent, { email: 'attacker_wallet_1622@gitpay.me' })
    const res = await agent
      .put(/wallets/)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', attacker.headers.authorization)
      .expect(404)
      .send({
        name: 'owned-by-attacker',
        amount: 500
      })

    expect(res.body.error).to.equal('No valid wallet')

    const unchanged = await models.Wallet.findOne({ where: { id: wallet.id } })
    expect(unchanged.name).to.equal('Owner Wallet')
    expect(unchanged.balance).to.equal('0.00')
  })
})
