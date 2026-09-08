import nock from 'nock'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory } from '../../factories'

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

    it('omits payout identifiers and email from the public user list', async () => {
      await UserFactory({
        name: 'Public User',
        paypal_id: 'hidden-paypal',
        account_id: 'acct_hidden',
        email: 'hidden-user@example.com'
      })

      const res = await agent.get('/users').expect('Content-Type', /json/).expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.be.an('array').that.is.not.empty
      const listed = res.body.find((row: any) => row.name === 'Public User')
      expect(listed).to.exist
      expect(listed).to.not.have.property('paypal_id')
      expect(listed).to.not.have.property('account_id')
      expect(listed).to.not.have.property('email')
      expect(listed).to.not.have.property('password')
      expect(listed.username).to.exist
    })

    it('includes email on a reset-token lookup but still omits payout identifiers', async () => {
      const user = await UserFactory({
        name: 'Reset User',
        email: 'reset-user@example.com',
        paypal_id: 'hidden-paypal-reset',
        recover_password_token: 'reset-token-public-search'
      })

      const res = await agent
        .get('/users')
        .query({ recover_password_token: 'reset-token-public-search' })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).to.be.an('array')
      const listed = res.body.find((row: any) => row.id === user.id)
      expect(listed).to.exist
      expect(listed.email).to.equal('reset-user@example.com')
      expect(listed).to.not.have.property('paypal_id')
      expect(listed).to.not.have.property('account_id')
      expect(listed).to.not.have.property('recover_password_token')
    })
  })
})
