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

describe('User Customer', () => {
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
})
