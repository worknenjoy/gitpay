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
  it('should update wallet name', async () => {
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
        name: 'Updated Wallet',
        amount: 100
      })
    expect(res.body).to.exist
    expect(res.body.id).to.exist
    expect(res.body.name).to.equal('Updated Wallet')
    expect(res.body.balance).to.equal('0.00')
  })

  it('should not update another user wallet', async () => {
    const victim = await registerAndLogin(agent)
    const wallet = await WalletFactory({
      userId: victim.body.id,
      name: 'Victim Wallet',
      balance: 0
    })
    const attacker = await registerAndLogin(agent)

    const res = await agent
      .put(`/wallets/${wallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', attacker.headers.authorization)
      .expect(404)
      .send({ name: 'Attacker Wallet', amount: 100 })

    expect(res.body).to.deep.equal({ error: 'wallet.not_found' })

    const victimWallet = await models.Wallet.findByPk(wallet.id)
    expect(victimWallet.name).to.equal('Victim Wallet')
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
})
