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

describe('PUT /user/bank_accounts', () => {
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

  describe('bank account', () => {
    it('should update bank account for user', async () => {
      nock('https://api.stripe.com')
        .get('/v1/accounts/acct_1CVSl2EI8tTzMKoL/external_accounts?object=bank_account')
        .reply(200, {
          object: 'list',
          data: [
            {
              object: 'bank_account',
              id: 'ba_1CVSl2EI8tTzMKoL'
            }
          ]
        })

      nock('https://api.stripe.com')
        .post('/v1/accounts/acct_1CVSl2EI8tTzMKoL/external_accounts/ba_1CVSl2EI8tTzMKoL')
        .reply(200, {
          object: 'account'
        })

      const res = await registerAndLogin(agent, {
        account_id: 'acct_1CVSl2EI8tTzMKoL'
      })

      const user = await agent
        .put(`/user/bank_accounts`)
        .send({
          account_id: 'acct_1CVSl2EI8tTzMKoL',
          routing_number: '110000000',
          account_number: '000123456789',
          country: 'US'
        })
        .set('Authorization', res.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.object).to.exist
    })
  })
})
