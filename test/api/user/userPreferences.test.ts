import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import githubOrg from '../../data/github/github.org'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('GET /user/preferences', () => {
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
})
