import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, UserFactory, AssignFactory, OrderFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /tasks/list', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
  })

  it('should list tasks and return an array', async () => {
    const user = await UserFactory()
    await TaskFactory({ userId: user.id })
    const res = await agent.get('/tasks/list').expect('Content-Type', /json/).expect(200)
    expect(res.body).to.be.an('array')
  })

  it('should return an empty array when no tasks exist', async () => {
    const res = await agent.get('/tasks/list').expect('Content-Type', /json/).expect(200)
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.equal(0)
  })

  describe('pagination', () => {
    it('should return paginated response with data and totalCount when limit is provided', async () => {
      const user = await UserFactory()
      await TaskFactory({ userId: user.id })
      await TaskFactory({ userId: user.id })
      await TaskFactory({ userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ limit: 2, page: 0 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('totalCount')
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(2)
      expect(res.body.totalCount).to.equal(3)
    })

    it('should return the second page correctly', async () => {
      const user = await UserFactory()
      await TaskFactory({ userId: user.id })
      await TaskFactory({ userId: user.id })
      await TaskFactory({ userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ limit: 2, page: 1 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(1)
      expect(res.body.totalCount).to.equal(3)
    })

    it('should return an empty page when page exceeds total', async () => {
      const user = await UserFactory()
      await TaskFactory({ userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ limit: 10, page: 5 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
      expect(res.body.totalCount).to.equal(1)
    })
  })

  describe('filter by userId (createdbyme tab)', () => {
    it('should return only tasks created by the given userId', async () => {
      const user1 = await UserFactory()
      const user2 = await UserFactory()
      await TaskFactory({ userId: user1.id })
      await TaskFactory({ userId: user1.id })
      await TaskFactory({ userId: user2.id })

      const res = await agent
        .get('/tasks/list')
        .query({ userId: user1.id, limit: 10, page: 0 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(2)
      expect(res.body.totalCount).to.equal(2)
      res.body.data.forEach((task: any) => {
        expect(task.userId).to.equal(user1.id)
      })
    })

    it('should return empty when userId has no tasks', async () => {
      const user1 = await UserFactory()
      const user2 = await UserFactory()
      await TaskFactory({ userId: user1.id })

      const res = await agent
        .get('/tasks/list')
        .query({ userId: user2.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
      expect(res.body.totalCount).to.equal(0)
    })
  })

  describe('filter by assignedTo (assigned tab)', () => {
    it('should return only tasks where the user is the accepted assignee', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task assigned to user (Task.assigned points to Assign record with userId = user)
      const assignedTask = await TaskFactory({ userId: otherUser.id })
      const assign = await AssignFactory({ TaskId: assignedTask.id, userId: user.id })
      await models.Task.update({ assigned: assign.id }, { where: { id: assignedTask.id } })

      // Task with no assignment at all
      await TaskFactory({ userId: otherUser.id })

      // Task where user has Assign record but Task.assigned is NOT set (just interested, not accepted)
      const interestedOnlyTask = await TaskFactory({ userId: otherUser.id })
      await AssignFactory({ TaskId: interestedOnlyTask.id, userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ assignedTo: user.id, limit: 10, page: 0 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(1)
      expect(res.body.data[0].id).to.equal(assignedTask.id)
    })

    it('should return empty when no tasks are assigned to the user', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task assigned to otherUser
      const task = await TaskFactory({ userId: otherUser.id })
      const assign = await AssignFactory({ TaskId: task.id, userId: otherUser.id })
      await models.Task.update({ assigned: assign.id }, { where: { id: task.id } })

      const res = await agent
        .get('/tasks/list')
        .query({ assignedTo: user.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
    })

    it('should not return a task where another user is assigned (not the queried user)', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task assigned to otherUser, but user also has an Assign record
      const task = await TaskFactory({})
      const assignOther = await AssignFactory({ TaskId: task.id, userId: otherUser.id })
      await AssignFactory({ TaskId: task.id, userId: user.id })
      // Only otherUser is the accepted assignee
      await models.Task.update({ assigned: assignOther.id }, { where: { id: task.id } })

      const res = await agent
        .get('/tasks/list')
        .query({ assignedTo: user.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
    })
  })

  describe('filter by interestedUserId (interested/following tab)', () => {
    it('should return tasks where the user has any Assign record (pending or accepted)', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task where user expressed interest (pending assign)
      const interestedTask = await TaskFactory({ userId: otherUser.id })
      await AssignFactory({ TaskId: interestedTask.id, userId: user.id, status: 'pending' })

      // Task where user is the accepted assignee (also has Assign record)
      const assignedTask = await TaskFactory({ userId: otherUser.id })
      const acceptedAssign = await AssignFactory({
        TaskId: assignedTask.id,
        userId: user.id,
        status: 'accepted'
      })
      await models.Task.update({ assigned: acceptedAssign.id }, { where: { id: assignedTask.id } })

      // Task user has no relation to
      await TaskFactory({ userId: otherUser.id })

      const res = await agent
        .get('/tasks/list')
        .query({ interestedUserId: user.id, limit: 10, page: 0 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(2)
      const ids = res.body.data.map((t: any) => t.id)
      expect(ids).to.include(interestedTask.id)
      expect(ids).to.include(assignedTask.id)
    })

    it('should return empty when user has no Assign records', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task with another user interested
      const task = await TaskFactory({ userId: otherUser.id })
      await AssignFactory({ TaskId: task.id, userId: otherUser.id })

      const res = await agent
        .get('/tasks/list')
        .query({ interestedUserId: user.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
    })
  })

  describe('filter by supportedByUserId (supported/sponsoring tab)', () => {
    it('should return tasks where the user has a succeeded order', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task with a succeeded order from user
      const supportedTask = await TaskFactory({ userId: otherUser.id })
      await OrderFactory({
        TaskId: supportedTask.id,
        userId: user.id,
        status: 'succeeded',
        paid: true
      })

      // Task with a non-succeeded order from user (should not appear)
      const pendingTask = await TaskFactory({ userId: otherUser.id })
      await OrderFactory({ TaskId: pendingTask.id, userId: user.id, status: 'open', paid: false })

      // Task with no orders
      await TaskFactory({ userId: otherUser.id })

      const res = await agent
        .get('/tasks/list')
        .query({ supportedByUserId: user.id, limit: 10, page: 0 })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(1)
      expect(res.body.data[0].id).to.equal(supportedTask.id)
    })

    it('should not return tasks with succeeded orders from a different user', async () => {
      const user = await UserFactory()
      const otherUser = await UserFactory()

      // Task with a succeeded order from otherUser only
      const task = await TaskFactory({})
      await OrderFactory({
        TaskId: task.id,
        userId: otherUser.id,
        status: 'succeeded',
        paid: true
      })

      const res = await agent
        .get('/tasks/list')
        .query({ supportedByUserId: user.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
    })

    it('should return empty when user has no succeeded orders', async () => {
      const user = await UserFactory()
      await TaskFactory()

      const res = await agent
        .get('/tasks/list')
        .query({ supportedByUserId: user.id, limit: 10, page: 0 })
        .expect(200)

      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(0)
    })
  })

  describe('safeIntParam validation', () => {
    it('should ignore non-integer values for assignedTo and return all tasks', async () => {
      const user = await UserFactory()
      await TaskFactory({ userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ assignedTo: 'invalid', limit: 10, page: 0 })
        .expect(200)

      // safeIntParam returns null for 'invalid', filter is not applied
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(1)
    })

    it('should ignore zero or negative values for interestedUserId', async () => {
      const user = await UserFactory()
      await TaskFactory({ userId: user.id })

      const res = await agent
        .get('/tasks/list')
        .query({ interestedUserId: 0, limit: 10, page: 0 })
        .expect(200)

      // safeIntParam requires n > 0, so 0 is treated as null (filter not applied)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.equal(1)
    })
  })
})
