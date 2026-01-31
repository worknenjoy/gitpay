import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import api from '../src/server'
import Models from '../src/models'
import { registerAndLogin, register, login, truncateModels } from './helpers'
import githubOrg from './data/github/github.org'
import secrets from '../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('Users', () => {
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

  describe('findAll User', () => {
    it('should find user', async () => {
      const res = await agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })
  })

  describe('register User', () => {
    it('should register and generate token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.activation_token).to.exist
      expect(res.body.email_verified).to.equal(false)
    })
    it('shouldnt register with long names', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          name: 'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name',
          email: 'teste@gmail.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.name.too.long')
    })
    it('shouldnt register with long email', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          email:
            'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.email.too.long')
    })
    it('shouldnt register with long password', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          email: 'email@test.com',
          password:
            'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.password.too.long')
    })
    it('should validate user activation token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste22222@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const activateRes = await agent
        .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
        .expect(200)
      
      expect(activateRes.statusCode).to.equal(200)
      expect(activateRes.body['email_verified']).to.equal(true)
    })
    it('should resend activation token with no existing one', async () => {
      const res = await registerAndLogin(agent)
      
      const resendRes = await agent
        .get(`/auth/resend-activation-email`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(resendRes.statusCode).to.equal(200)
      expect(resendRes.body['email_verified']).to.equal(false)
      expect(resendRes.body['activation_token']).to.exist
    })
    it('should resend user activation token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste22222@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const activateRes = await agent
        .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
        .expect(200)
      
      expect(activateRes.statusCode).to.equal(200)
      expect(activateRes.body['email_verified']).to.equal(true)
    })
    it('dont allow register with the same user', async () => {
      await agent
        .post('/auth/register')
        .send({ email: 'teste43434343@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste43434343@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(403)
      
      expect(res.statusCode).to.equal(403)
      expect(res.body.message).to.equal('user.exist')
    })
    it('register with user Types', async () => {
      // Ensure the types exist, then use their real IDs (avoid relying on seed order/IDs)
      const { Type } = require('../src/models')
      const [funding] = await Type.findOrCreate({
        where: { name: 'funding' },
        defaults: { name: 'funding' }
      })
      const [contributor] = await Type.findOrCreate({
        where: { name: 'contributor' },
        defaults: { name: 'contributor' }
      })

      const res = await agent
        .post('/auth/register')
        .send({
          email: 'teste4343434322222@gmail.com',
          password: 'test',
          Types: [String(funding.id), String(contributor.id)]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.Types).to.exist
      const typeNames = (res.body.Types || []).map((t: any) => t.name)
      expect(typeNames).to.include('funding')
      expect(typeNames).to.include('contributor')
    })
  })

  describe('User delete', () => {
    it('Should delete user', async () => {
      const res = await registerAndLogin(agent)
      console.log(res.statusCode, res.headers)
      const userId = res.body.id
      
      const user = await agent
        .delete(`/user/delete/`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.text).to.equal('1')
      const users = models.User.findAll({ where: { id: userId } })
      expect(users).to.exist
    })
  })

  describe('login User Local', () => {
    it('should user local', async () => {
      await agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .type('form')
        .expect('Content-Type', /json/)
      
      const res = await agent
        .post('/authorize/local')
        .send({ username: 'teste@gmail.com', password: 'teste' })
        .type('form')
        .expect(302)
      
      expect(res.statusCode).to.equal(302)
      expect(res.text).to.include('token')
    })
  })

  describe('login User social networks', () => {
    it('should user wrong authentication', async () => {
      const res = await agent
        .get('/authenticated')
        .set('authorization', 'Bearer token-123') // 1) using the authorization header
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
    })

    it('should user google', async () => {
      const res = await agent
        .get('/authorize/google')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)
      
      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include(
        'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgoogle&scope=email&client_id='
      )
    })
    it('should user bitbucket', async () => {
      const res = await agent
        .get('/authorize/bitbucket')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)
      
      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include('https://bitbucket.org/site/oauth2/authorize')
    })
    it('should user login with github', async () => {
      const res = await agent
        .get('/authorize/github')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)
      
      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub&scope=user%3Aemail&client_id='
      )
    })
    xit('should callback after authorize on github', async () => {
      const res = await agent
        .get('/callback/github')
        .send({ scope: ['user:email'] })
        .expect(200)
      
      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate%3FuserId%3Dundefined%26url%3Dundefined&scope=repo&client_id='
      )
    })
    it('should user ask permissions with github to access private issue', async () => {
      const res = await agent
        .get('/authorize/github/private')
        .send({ userId: 2, url: 'https://github.com/alexanmtz/project/issues/2', code: '123' })
        .expect(302)
      
      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate%3FuserId%3Dundefined%26url%3Dundefined&scope=repo&client_id='
      )
    })
  })

  describe('Customer get', () => {
    it('should try get customer info with no customer', async () => {
      const res = await registerAndLogin(agent)
      
      const customerRes = await agent
        .get(`/user/customer/`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(customerRes.statusCode).to.equal(200)
      expect(customerRes.body).to.equal(false)
    })
    it('should try get customer info with customer id set', async () => {
      nock('https://api.stripe.com').get('/v1/customers/cus_Ec8ZOuHXnSlBh8').reply(200, {
        id: 'cus_Ec8ZOuHXnSlBh8',
        object: 'customer'
      })
      nock('https://api.stripe.com').post('/v1/accounts').reply(200, {})

      const res = await registerAndLogin(agent, {
        customer_id: 'cus_Ec8ZOuHXnSlBh8'
      })
      
      const user = await agent
        .get(`/user/customer/`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.body.object).to.equal('customer')
      expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8')
    })
  })

  describe('Customer create', () => {
    it('should try to create new customer', async () => {
      nock('https://api.stripe.com').post('/v1/customers').reply(200, {
        id: 'cus_Ec8ZOuHXnSlBh8',
        object: 'customer',
        name: 'test',
        email: 'test'
      })

      const res = await registerAndLogin(agent)
      
      const user = await agent
        .post(`/user/customer/`)
        .send({ name: 'test', email: res.body.email })
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8')
    })
  })

  describe('Customer update', () => {
    it('should try to update customer', async () => {
      nock('https://api.stripe.com').post('/v1/customers/cus_Ec8ZOuHXnSlBh8').reply(200, {
        id: 'cus_Ec8ZOuHXnSlBh8',
        object: 'customer',
        name: 'test2',
        email: 'test'
      })

      const res = await registerAndLogin(agent, {
        customer_id: 'cus_Ec8ZOuHXnSlBh8'
      })
      
      const user = await agent
        .put(`/user/customer/`)
        .send({ name: 'test2' })
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.body.id).to.equal('cus_Ec8ZOuHXnSlBh8')
      expect(user.body.name).to.equal('test2')
    })
  })

  describe('user preferences', () => {
    xit('should retrieve user preferences', async () => {
      const res = await registerAndLogin(agent, {
        email: 'teste@gmail.com',
        password: 'teste',
        country: 'usa',
        language: 'en'
      })
      
      const user = await agent
        .get(`/user/preferences`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.body.language).to.exist
      expect(user.body.country).to.exist
    })
  })

  xdescribe('user organizations', () => {
    xit('should create organization and associate with an user', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)
      
      const res = await register(agent, {
        email: 'test_user_organizations_create@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const UserId = res.body.id
      
      const login = await login(agent, {
        email: 'test_user_organizations_create@gmail.com',
        password: 'test'
      })
      
      await agent
        .post(`/organizations/create`)
        .send({ UserId, name: 'test' })
        .set('Authorization', login.headers.authorization)
        .expect(200)
      
      const orgs = await agent
        .get(`/user/organizations`)
        .send({ id: UserId })
        .set('Authorization', login.headers.authorization)
        .expect(200)
      
      expect(orgs.statusCode).to.equal(200)
      expect(orgs.body[0].name).to.equal('test')
      expect(orgs.body[0].imported).to.equal(true)
    })
    xit('should retrieve user github organizations', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)
      
      const res = await register(agent, {
        email: 'test_user_organizations@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const userId = res.body.id
      
      const loginRes = await login(agent, {
        email: 'test_user_organizations@gmail.com',
        password: 'test'
      })
      
      const orgs = await agent
        .get(`/user/organizations`)
        .send({ id: userId })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)
      
      expect(orgs.statusCode).to.equal(200)
      expect(orgs.body[0].name).to.equal('test')
      expect(orgs.body[0].imported).to.equal(false)
    })
    xit('should check if that organizations exist, if exist return true if already imported', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)
      
      const res = await register(agent, {
        email: 'test_user_organizations_exist@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const userId = res.body.id
      
      const loginRes = await login(agent, {
        email: 'test_user_organizations_exist@gmail.com',
        password: 'test'
      })
      
      const user = await agent
        .get(`/user/organizations`)
        .send({ id: userId, organization: 'foo' })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.body).to.equal(false)
    })
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
