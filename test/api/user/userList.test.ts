import nock from 'nock'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'

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
      const res = await agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })
  })
})
