import { expect } from 'chai'
import request from 'supertest'
import Models from '../../../src/models'
import { createTask, login, registerAndLogin, truncateModels } from '../../helpers'
import { OrderFactory } from '../../factories'
import api from '../../../src/server'

const agent = request.agent(api) as any
const models = Models as any

describe('DELETE /tasks/delete/:id', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
    await truncateModels(models.Task)
    await truncateModels(models.Order)
  })

  it('should delete a task by id', async () => {
    const task = await createTask(agent)

    const { headers, body: createdTask } = task || {}

    const res = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers?.authorization)
      .expect(200)
    expect(await models.Task.findByPk(createdTask.id)).to.be.null
  })

  it('should only delete own task', async () => {
    const task = await createTask(agent)

    const { headers, body: createdTask } = task || {}

    const deleted = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers?.authorization)
      .expect(200)

    expect(deleted.text).to.equal('1')
  })
  it('should not delete task of another user', async () => {
    const task = await createTask(agent)

    const { headers, body: createdTask } = task || {}

    const anotherUser = await registerAndLogin(agent, {
      email: 'anotheruser@example.com',
      password: 'anotherpassword'
    })

    const { headers: anotherUserHeaders } = anotherUser || {}

    const deleted = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', anotherUserHeaders?.authorization)
      .expect(200)

    expect(deleted.text).to.equal('0')
    expect(await models.Task.findByPk(createdTask.id)).to.not.be.null
  })
  it('should not delete the records related to a task of another user', async () => {
    const task = await createTask(agent)

    const { body: createdTask } = task || {}

    const anotherUser = await registerAndLogin(agent, {
      email: 'anotheruser@example.com',
      password: 'anotherpassword'
    })

    const { headers: anotherUserHeaders, body: anotherUserBody } = anotherUser || {}

    await models.Offer.create({
      userId: anotherUserBody.id,
      taskId: createdTask.id,
      value: 50
    })
    await models.Member.create({ userId: anotherUserBody.id, taskId: createdTask.id })
    await models.History.create({ type: 'create', fields: ['title'], TaskId: createdTask.id })
    const label = await models.Label.create({ name: 'help wanted' })
    await models.sequelize.query(
      `INSERT INTO "TaskLabels" ("labelId", "taskId", "createdAt", "updatedAt") VALUES (?, ?, now(), now())`,
      { replacements: [label.id, createdTask.id] }
    )

    const relatedRecordCounts = async () => {
      const [taskLabels] = await models.sequelize.query(
        `SELECT count(*)::int AS count FROM "TaskLabels" WHERE "taskId" = ?`,
        { replacements: [createdTask.id] }
      )
      return {
        offers: await models.Offer.count({ where: { taskId: createdTask.id } }),
        members: await models.Member.count({ where: { taskId: createdTask.id } }),
        histories: await models.History.count({ where: { TaskId: createdTask.id } }),
        taskLabels: taskLabels[0].count
      }
    }

    const before = await relatedRecordCounts()

    const deleted = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', anotherUserHeaders?.authorization)
      .expect(200)

    expect(deleted.text).to.equal('0')
    expect(await models.Task.findByPk(createdTask.id)).to.not.be.null
    expect(await relatedRecordCounts()).to.deep.equal(before)
  })
  it('should return 403 when not authenticated', async () => {
    const task = await createTask(agent)

    const { body: createdTask } = task || {}

    await agent.delete(`/tasks/delete/${createdTask.id}`).expect(403)
  })
  it('should return error when deleting task with orders', async () => {
    const task = await createTask(agent, { status: 'paid' })

    const { headers, body: createdTask } = task || {}

    const order = await OrderFactory({
      TaskId: createdTask.id,
      amount: 100,
      currency: 'USD',
      userId: createdTask.userId,
      status: 'completed'
    })

    const res = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers?.authorization)
      .expect(500)
    expect(res.body.error).to.equal('CANNOT_DELETE_ISSUE_WITH_ORDERS_ASSOCIATED')
    expect(await models.Task.findByPk(createdTask.id)).to.not.be.null
  })
})
