import nock from 'nock'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory } from '../../factories/userFactory'

const models = Models as any
const agent = request.agent(api)

describe('GET /user', () => {
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
      const res = await agent.get('/users').expect('Content-Type', /json/).expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })

    it('should not expose email, account_id or paypal_id on a public id lookup', async () => {
      const user = await UserFactory({ account_id: 'acct_123', paypal_id: 'paypal_123', openForJobs: true })

      const res = await agent.get(`/users?id=${user.id}`).expect('Content-Type', /json/).expect(200)

      expect(res.body[0]).to.exist
      expect(res.body[0]).to.not.have.property('email')
      expect(res.body[0]).to.not.have.property('account_id')
      expect(res.body[0]).to.not.have.property('paypal_id')
      expect(res.body[0]).to.have.property('openForJobs', true)
    })

    it('should expose email when looking up by a recover_password_token', async () => {
      const user = await UserFactory({ recover_password_token: 'sometoken123' })

      const res = await agent
        .get('/users?recover_password_token=sometoken123')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body[0]).to.exist
      expect(res.body[0]).to.have.property('email', user.email)
    })
  })
})
