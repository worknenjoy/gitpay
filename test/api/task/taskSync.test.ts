import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import nock from 'nock'

const models = Models as any
const agent = request.agent(api)

xdescribe('GET /task/sync', () => {
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

  xit('should sync with an open order', async () => {
    const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
    const order = await task.createOrder({
      source_id: '12345',
      currency: 'BRL',
      amount: 200
    })

    const res = await agent
      .get(`/tasks/${task.dataValues.id}/sync/value`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.value.available).to.equal(0)
    expect(res.body.value.pending).to.equal(200)
  })

  it('should sync with a succeeded order', async () => {
    const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
    const order = await task.createOrder({
      source_id: '12345',
      currency: 'BRL',
      amount: 200,
      status: 'succeeded'
    })

    const res = await agent
      .get(`/tasks/${task.dataValues.id}/sync/value`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.exist
    expect(res.body.value.available).to.equal(200)
    expect(res.body.value.pending).to.equal(0)
  })
})
