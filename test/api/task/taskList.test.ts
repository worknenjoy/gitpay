import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import nock from 'nock'

const models = Models as any
const agent = request.agent(api)

xdescribe('GET /task', () => {
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

  it('should list tasks', async () => {
    const res = await agent.get('/tasks/list').expect('Content-Type', /json/).expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
  })
})
