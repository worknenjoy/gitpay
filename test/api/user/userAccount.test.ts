import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import githubOrg from '../../data/github/github.org.json'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('User Account', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  describe('user account', () => {
    it('should retrieve account for user', async () => {
      nock('https://api.stripe.com').get('/v1/accounts/acct_1CVSl2EI8tTzMKoL').reply(200, {
        object: 'account'
      })

      const reg = await register(agent, {
        email: 'test_user_account@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      })
      const userId = reg.body.id

      const loginRes = await login(agent, {
        email: 'test_user_account@gmail.com',
        password: 'test'
      })

      const user = await agent
        .get(`/user/account`)
        .send({ id: userId })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.object).to.equal('account')
    })

    it('should retrieve user account balance', async () => {
      nock('https://api.stripe.com')
        .get('/v1/balance')
        .reply(200, {
          object: 'balance',
          available: [
            {
              amount: 1000,
              currency: 'usd'
            }
          ],
          pending: [
            {
              amount: 500,
              currency: 'usd'
            }
          ]
        })

      const res = await registerAndLogin(agent, {
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      })

      const account = await agent
        .get(`/user/account/balance`)
        .set('Authorization', res.headers.authorization)
        .expect(200)

      expect(account.statusCode).to.equal(200)
      expect(account.body.object).to.equal('balance')
      expect(account.body.available[0].amount).to.equal(1000)
      expect(account.body.available[0].currency).to.equal('usd')
      expect(account.body.pending[0].amount).to.equal(500)
      expect(account.body.pending[0].currency).to.equal('usd')
    })

    it('should retrieve country specs for user', async () => {
      nock('https://api.stripe.com').get('/v1/accounts/acct_1CVSl2EI8tTzMKoL').reply(200, {
        object: 'account',
        country: 'US'
      })

      nock('https://api.stripe.com').get('/v1/country_specs/US').reply(200, {
        object: 'country_spec'
      })

      const reg = await register(agent, {
        email: 'test_user_account@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      })
      const userId = reg.body.id

      const loginRes = await login(agent, {
        email: 'test_user_account@gmail.com',
        password: 'test'
      })

      const user = await agent
        .get(`/user/account/countries`)
        .send({ id: userId })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.object).to.equal('country_spec')
    })

    it('should create account for user in US', async () => {
      nock('https://api.stripe.com').post('/v1/accounts').reply(
        200,
        {
          id: 'acct_1CVSl2EI8tTzMKoL',
          object: 'account',
          country: 'US'
        },
        {
          'Content-Type': 'application/json'
        }
      )

      const reg = await register(agent, {
        email: 'test_user_account_create@gmail.com',
        password: 'test'
      })
      const userId = reg.body.id

      const loginRes = await login(agent, {
        email: 'test_user_account_create@gmail.com',
        password: 'test'
      })

      const finalResponse = await agent
        .post(`/user/account`)
        .send({ id: userId, country: 'US' })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(finalResponse.statusCode).to.equal(200)
      expect(finalResponse.body.object).to.equal('account')
      expect(finalResponse.body.country).to.equal('US')
    })

    xit('should update account for user', async () => {
      nock('https://api.stripe.com').post('/v1/accounts/acct_1CVSl2EI8tTzMKoL').reply(200, {
        object: 'account'
      })

      const reg = await register(agent, {
        email: 'test_user_account_update@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      })
      const userId = reg.body.id

      const loginRes = await login(agent, {
        email: 'test_user_account_update@gmail.com',
        password: 'test'
      })

      const user = await agent
        .put(`/user/account`)
        .send({
          id: userId,
          account: {}
        })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.object).to.equal('account')
    })

    it('should delete account', async () => {
      nock('https://api.stripe.com').delete('/v1/accounts/acct_1CVSl2EI8tTzMKoL').reply(200, {
        deleted: true
      })

      const reg = await register(agent, {
        email: 'test_user_account_delete@gmail.com',
        password: 'test',
        account_id: 'acct_1CVSl2EI8tTzMKoL',
        country: 'US'
      })
      const userId = reg.body.id

      const loginRes = await login(agent, {
        email: 'test_user_account_delete@gmail.com',
        password: 'test'
      })

      const user = await agent
        .delete(`/user/account`)
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.id).to.equal(userId)
      expect(user.body.account_id).to.equal(null)
      expect(user.body.country).to.equal(null)
    })
  })
})
