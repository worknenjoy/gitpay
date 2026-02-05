import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import nock from 'nock'

const models = Models as any
const agent = request.agent(api)

xdescribe('GET /task/history', () => {
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

  it('should create a new task and register on task history', async () => {
    const res = await registerAndLogin(agent)
    const taskRes = await agent
      .post('/tasks/create/')
      .send({ url: 'https://github.com/worknenjoy/truppie/issues/99' })
      .set('Authorization', res.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)
    
    const history = await models.History.findOne({ where: { TaskId: taskRes.body.id } })
    expect(history).to.exist
    expect(history.TaskId).to.equal(taskRes.body.id)
    expect(history.type).to.equal('create')
    expect(history.fields).to.have.all.members(['url', 'userId'])
    expect(history.oldValues).to.have.all.members([null, null])
    expect(history.newValues).to.have.all.members([
      'https://github.com/worknenjoy/truppie/issues/99',
      `${taskRes.body.userId}`
    ])
  })

  xit('should sync with a succeeded order and track history', async () => {
    const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
    const order = await task.createOrder({
      source_id: '12345',
      currency: 'BRL',
      amount: 256,
      status: 'succeeded'
    })
    
    await agent
      .get(`/tasks/${task.dataValues.id}/sync/value`)
      .expect('Content-Type', /json/)
      .expect(200)
    
    const histories = await models.History.findAll({
      where: { TaskId: task.dataValues.id },
      order: [['id', 'DESC']]
    })
    
    expect(histories.length).to.equal(2)
    const history = histories[0]
    expect(history).to.exist
    expect(history.TaskId).to.equal(task.dataValues.id)
    expect(history.type).to.equal('update')
    expect(history.fields).to.have.all.members(['value'])
    expect(history.oldValues).to.have.all.members([null])
    expect(history.newValues).to.have.all.members(['256'])
  })
})
