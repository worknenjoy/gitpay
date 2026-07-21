import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import { withPaymentProvider, WHOP_API_HOST } from '../../helpers/whop'
import Models from '../../../src/models'

const agent = request.agent(api) as any
const models = Models as any

describe('POST /payouts/request (Whop)', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Payout)
    process.env.WHOP_API_KEY = 'test_whop_key'
    process.env.WHOP_COMPANY_ID = 'biz_test_platform'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create a Whop withdrawal payout', async () => {
    await withPaymentProvider('whop', async () => {
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

  it('should error when user has no whop_account_id', async () => {
    await withPaymentProvider('whop', async () => {
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
})
