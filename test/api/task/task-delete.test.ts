import { expect } from 'chai'
import request from 'supertest'
import Models  from '../../../src/models'
import { createTask, login, registerAndLogin, truncateModels } from "../../helpers"
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

    const { headers, body: createdTask } = task || { }

    const res = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers.authorization)
      .expect(200)
    expect(await models.Task.findByPk(createdTask.id)).to.be.null
  })

  it('should only delete own task', async () => {
    const task = await createTask( agent )

    const { headers, body: createdTask } = task || { }

    const deleted = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers.authorization)
      .expect(200)

    expect(deleted.text).to.equal('1')
  })
  it('should not delete task of another user', async () => {
    const task = await createTask( agent )

    const { body: createdTask } = task || { }

    const anotherUser = await registerAndLogin(agent, {
      email: 'anotheruser@example.com',
      password: 'anotherpassword'
    })

    const { headers: anotherUserHeaders } = anotherUser || { }

    const deleted = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', anotherUserHeaders.authorization)
      .expect(200)

    expect(deleted.text).to.equal('0')
    expect(await models.Task.findByPk(createdTask.id)).to.not.be.null
  })
  it('should return 403 when not authenticated', async () => {
    const task = await createTask( agent )

    const { body: createdTask } = task || { }

    await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .expect(403)
  })
  it('should return error when deleting task with orders', async () => {
    const task = await createTask( agent, { status: 'paid' } )

    const { headers, body: createdTask } = task || { }

    const order = await models.Order.create({
      TaskId: createdTask.id,
      amount: 100,
      currency: 'USD',
      userId: createdTask.userId,
      status: 'completed'
    })

    const res = await agent
      .delete(`/tasks/delete/${createdTask.id}`)
      .set('Authorization', headers.authorization)
      .expect(500)
    expect(res.body.error).to.equal(
      'Cannot delete issue with associated orders'
    )
    expect(await models.Task.findByPk(createdTask.id)).to.not.be.null
  })
})
