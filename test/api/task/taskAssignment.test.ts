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

xdescribe('Task Assignment', () => {
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


describe('PUT /tasks/:id/assignment/remove - Authorization & Ownership Protection (#1623)', () => {
  let ownerUser: any
  let contributorUser: any
  let attackerUser: any
  let task: any
  let assign: any

  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)

    ownerUser = await registerAndLogin(agent, {
      name: 'Task Owner',
      email: 'owner@example.com',
      password: 'password123'
    })

    contributorUser = await registerAndLogin(agent, {
      name: 'Contributor User',
      email: 'contributor@example.com',
      password: 'password123'
    })

    attackerUser = await registerAndLogin(agent, {
      name: 'Attacker User',
      email: 'attacker@example.com',
      password: 'password123'
    })

    task = await TaskFactory({
      userId: ownerUser.body.id,
      title: 'Bounty Task in Progress',
      url: 'https://github.com/worknenjoy/gitpay/issues/100',
      status: 'in_progress'
    })

    assign = await AssignFactory({
      userId: contributorUser.body.id,
      TaskId: task.id,
      status: 'accepted'
    })

    await task.update({ assigned: assign.id })
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  it('should return 403 Forbidden and NOT unassign task when non-owner attempts to remove assignment', async () => {
    const res = await agent
      .put(`/tasks/${task.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', attackerUser.headers.authorization)
      .send({ message: 'Attacker attempting unauthorized unassign' })

    expect(res.status).to.equal(403)
    expect(res.body.error).to.equal('Unauthorized')

    const refreshedTask = await models.Task.findByPk(task.id)
    expect(refreshedTask.status).to.equal('in_progress')
    expect(refreshedTask.assigned).to.equal(assign.id)
  })

  it('should return 404 Not Found when attempting to remove assignment on non-existent task', async () => {
    const nonExistentTaskId = 999999
    const res = await agent
      .put(`/tasks/${nonExistentTaskId}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Removing from non-existent task' })

    expect(res.status).to.equal(404)
    expect(res.body.error).to.equal('Task not found')
  })

  it('should return 400 Bad Request when task has no assigned user', async () => {
    const unassignedTask = await TaskFactory({
      userId: ownerUser.body.id,
      title: 'Unassigned Task',
      url: 'https://github.com/worknenjoy/gitpay/issues/101',
      status: 'open',
      assigned: null
    })

    const res = await agent
      .put(`/tasks/${unassignedTask.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Remove unassigned user' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal("The Task doesn't have an assigned user.")
  })

  it('should allow legitimate task owner to remove assignment and reset task to open', async () => {
    const res = await agent
      .put(`/tasks/${task.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Owner removing contributor for inactivity' })

    expect(res.status).to.equal(200)

    const updatedTask = await models.Task.findByPk(task.id)
    expect(updatedTask.status).to.equal('open')
    expect(updatedTask.assigned).to.be.null

    const updatedAssign = await models.Assign.findByPk(assign.id)
    expect(updatedAssign.status).to.equal('pending')
  })
})
