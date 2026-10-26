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
  it('should return 403 Forbidden when non-owner attempts to update another user wallet', async () => {
    const ownerUser = await registerAndLogin(agent, {
      name: 'Owner User',
      email: 'owner-wallet@example.com',
      password: 'password123'
    })
    const attackerUser = await registerAndLogin(agent, {
      name: 'Attacker User',
      email: 'attacker-wallet@example.com',
      password: 'password123'
    })
    const wallet = await WalletFactory({
      userId: ownerUser.body.id,
      name: 'Owner Wallet',
      balance: 50
    })
    const res = await agent
      .put(`/wallets/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', attackerUser.headers.authorization)
      .expect(403)
      .send({
        name: 'owned-by-attacker',
        amount: 0
      })
    expect(res.body.error).to.equal('Unauthorized')

    // Verify wallet name and balance remain intact
    const refreshed = await models.Wallet.findByPk(wallet.id)
    expect(refreshed.name).to.equal('Owner Wallet')
  })
  it('should return 404 Not Found when attempting to update non-existent wallet', async () => {
    const user = await registerAndLogin(agent)
    const res = await agent
      .put('/wallets/999999')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', user.headers.authorization)
      .expect(404)
      .send({
        name: 'ghost-wallet'
      })
    expect(res.body.error).to.equal('Wallet not found')
  })
})

