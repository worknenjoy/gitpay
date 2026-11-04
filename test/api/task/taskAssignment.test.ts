import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { register, login, truncateModels } from '../../helpers'
import { TaskFactory } from '../../factories'
import nock from 'nock'
import { taskUpdate } from '../../../src/modules/tasks/taskUpdate'

const models = Models as any
const agent = request.agent(api)

const buildTask = (params: any) => {
  const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
  return TaskFactory({
    userId: params.userId,
    url: github_url,
    provider: 'github',
    title: params.title || 'Issue 76!'
  })
}

xdescribe('Task Assignment'
  it('should reject unassigning task when caller is not the task owner (Issue #1623)', async () => {
    const owner = await register(agent, {
      name: 'Real Owner',
      email: 'real_owner@example.com',
      password: 'password123'
    })
    const attacker = await register(agent, {
      name: 'Attacker User',
      email: 'attacker@example.com',
      password: 'password123'
    })
    const task = await buildTask({ userId: owner.body.id, title: 'Protected Bounty' })

    const token = await login(agent, { email: 'attacker@example.com', password: 'password123' })
    const res = await agent
      .put(`/tasks/${task.id}/assignment/remove`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'malicious removal attempt' })

    expect(res.status).to.be.oneOf([403, 400])
  })
, () => {
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

  xit('should send email for a user interested to and user accept', async () => {
    const firstUser = await register(agent, {
      name: 'Task Owner',
      email: 'owner@example.com',
      password: '1234'
    })
    const ownerId = firstUser.body.id
    const task = await buildTask({ userId: ownerId, title: 'Test Title!' })
    const taskId = task.id

    const userToBeAssigned = await register(agent, {
      name: 'Assigned User',
      email: 'assigned@example.com',
      password: '1234'
    })
    const userToBeAssignedId = userToBeAssigned.body.id

    const logged = await login(agent, { email: 'owner@example.com', password: '1234' })

    const updateRes = await taskUpdate({
      id: taskId,
      Offer: { userId: userToBeAssignedId, taskId, value: 101 }
    })

    const assigns = await models.Assign.findAll({ where: { TaskId: updateRes.id } })
    const assignId = assigns[0].dataValues.id

    await agent
      .post('/tasks/assignment/request/')
      .set('Authorization', logged.headers.authorization)
      .send({
        assignId,
        taskId
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const confirmRes = await agent
      .put(`/tasks/assignment/request/`)
      .set('Authorization', logged.headers.authorization)
      .send({
        assignId,
        taskId,
        confirm: true
      })
      .expect(200)

    expect(confirmRes.statusCode).to.equal(200)

    const tasks = await models.Task.findAll({
      include: { all: true }
    })

    const assign = tasks[0].Assigns[0]
    const offer = tasks[0].Offers[0]
    const taskResult = tasks[0]
    expect(assign.status).to.equal('accepted')
    expect(taskResult.status).to.equal('in_progress')
    expect(offer.userId).to.equal(userToBeAssignedId)
    expect(offer.taskId).to.equal(taskId)
    expect(assign.userId).to.equal(userToBeAssignedId)
    expect(assign.TaskId).to.equal(taskId)
  })

  xit('should send email for a user interested to and user rejected ', async () => {
    const firstUser = await register(agent, {
      name: 'Task Owner',
      email: 'owner@example.com',
      password: '1234'
    })
    const ownerId = firstUser.body.id
    const task = await buildTask({ userId: ownerId, title: 'Test Title!' })
    const taskId = task.id

    const userToBeAssigned = await register(agent, {
      name: 'Assigned User',
      email: 'assigned@example.com',
      password: '1234'
    })
    const userToBeAssignedId = userToBeAssigned.body.id

    const logged = await login(agent, { email: 'owner@example.com', password: '1234' })

    const updateRes = await taskUpdate({
      id: taskId,
      Offer: { userId: userToBeAssignedId, taskId, value: 101 }
    })

    const assigns = await models.Assign.findAll({ where: { TaskId: updateRes.id } })
    const assignId = assigns[0].dataValues.id

    await agent
      .post('/tasks/assignment/request/')
      .set('Authorization', logged.headers.authorization)
      .send({
        assignId,
        taskId
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const confirmRes = await agent
      .put(`/tasks/assignment/request/`)
      .set('Authorization', logged.headers.authorization)
      .send({
        assignId,
        taskId,
        confirm: false,
        message: 'reject message'
      })
      .expect(200)

    expect(confirmRes.statusCode).to.equal(200)

    const tasks = await models.Task.findAll({
      include: { all: true }
    })

    const assign = tasks[0].Assigns[0]
    const taskResult = tasks[0]
    expect(assign.status).to.be.equal('rejected')
    expect(assign.message).to.equal('reject message')
    expect(taskResult.status).to.be.equal('open')
  })
})
