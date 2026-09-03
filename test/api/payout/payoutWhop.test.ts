import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, pinWhopApiForTests, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'

const agent = request.agent(api) as any
const models = Models as any

describe('POST /payouts/request (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Payout)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
    pinWhopApiForTests()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create a Whop withdrawal payout', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_1')
        .reply(200, { capabilities: { standard_payout: 'active' } })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_1' })
        .reply(200, [{ id: 'pm_test_1', nickname: 'Test Bank', is_default: true }])
      nock(WHOP_API_HOST)
        .post('/api/v1/withdrawals')
        .reply(200, {
          id: 'wdrl_test_whop_1',
          status: 'pending',
          amount: 50
        })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_1' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .post('/payouts/request')
        .set('Authorization', user.headers.authorization)
        .send({
          amount: 50,
          currency: 'usd',
          method: 'whop',
          payout_method_id: 'pm_test_1'
        })
        .expect(200)

      expect(res.body.error).to.not.exist
      expect(res.body.source_id).to.equal('wdrl_test_whop_1')
      expect(res.body.method).to.equal('whop')
    })
  })

  it('should default to the account default payout method when none is sent by the client', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      nock(WHOP_API_HOST)
        .get('/api/v1/accounts/biz_user_whop_1')
        .reply(200, { capabilities: { standard_payout: 'active' } })
      nock(WHOP_API_HOST)
        .get('/api/v1/payout_methods')
        .query({ company_id: 'biz_user_whop_1' })
        .reply(200, [{ id: 'pm_default_1', nickname: 'Pix Itau', is_default: true }])
      nock(WHOP_API_HOST)
        .post('/api/v1/withdrawals', (body) => body.payout_method_id === 'pm_default_1')
        .reply(200, {
          id: 'wdrl_test_whop_2',
          status: 'pending',
          amount: 50
        })

      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_1' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .post('/payouts/request')
        .set('Authorization', user.headers.authorization)
        .send({
          amount: 50,
          currency: 'usd',
          method: 'whop'
        })
        .expect(200)

      expect(res.body.error).to.not.exist
      expect(res.body.source_id).to.equal('wdrl_test_whop_2')
    })
  })

  it('should error when user has no whop_account_id', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      const user = await registerAndLogin(agent)

      const res = await agent
        .post('/payouts/request')
        .set('Authorization', user.headers.authorization)
        .send({
          amount: 50,
          currency: 'usd',
          method: 'whop'
        })
        .expect(400)

      expect(res.body.error).to.include('Whop')
    })
  })

  it('should error with payout_not_ready when the Whop account has no payout method on file', async () => {
    await withPaymentProvider('whop', async () => {
      pinWhopApiForTests()
      // No /accounts or /payout_methods mocks: userAccount() resolves those as
      // unavailable/empty, so the account is not "active" — the guard should reject
      // before ever reaching /withdrawals (left unmocked on purpose, see assertion below).
      const user = await registerAndLogin(agent)
      await models.User.update(
        { whop_account_id: 'biz_user_whop_1' },
        { where: { id: user.body.id } }
      )

      const res = await agent
        .post('/payouts/request')
        .set('Authorization', user.headers.authorization)
        .send({
          amount: 50,
          currency: 'usd',
          method: 'whop'
        })
        .expect(400)

      expect(res.body.code).to.equal('payout_not_ready')
    })
  })
})
