import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, UserFactory } from '../../factories'
// @ts-ignore - jsonwebtoken has no type definitions
import jwt from 'jsonwebtoken'

const models = Models as any
const agent = request.agent(api)

const makeToken = (payload: object, secret = process.env.SECRET_PHRASE as string) =>
  jwt.sign(payload, secret)

describe('POST /tasks/:id/donate-to-platform-funds', () => {
  let userId: number

  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    const user = await UserFactory()
    userId = user.id
  })

  it('should close the task with closed_reason=other and set a comment when given a valid donate token', async () => {
    const task = await TaskFactory({ state: 'funded', userId })
    const token = makeToken({ taskId: task.id, userId, action: 'donate' })

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({ token })
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body.success).to.be.true
    expect(res.body.issue).to.exist
    expect(res.body.issue.state).to.equal('closed')
    expect(res.body.issue.closed_reason).to.equal('other')
    expect(res.body.issue.comment).to.equal('donated claimed bounty to Gitpay platform')
    expect(res.body.issue.closed_at).to.exist

    const updated = await models.Task.findByPk(task.id)
    expect(updated.state).to.equal('closed')
    expect(updated.closed_reason).to.equal('other')
    expect(updated.comment).to.equal('donated claimed bounty to Gitpay platform')
  })

  it('should return 400 when token is missing', async () => {
    const task = await TaskFactory({ state: 'funded', userId })

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)

    expect(res.body.error).to.equal('missing_token')
  })

  it('should return 401 when token is signed with a wrong secret', async () => {
    const task = await TaskFactory({ state: 'funded', userId })
    const token = makeToken({ taskId: task.id, userId, action: 'donate' }, 'wrong-secret')

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({ token })
      .expect('Content-Type', /json/)
      .expect(401)

    expect(res.body.error).to.equal('invalid_token')
  })

  it('should return 401 when token action is not donate', async () => {
    const task = await TaskFactory({ state: 'funded', userId })
    const token = makeToken({ taskId: task.id, userId, action: 'claim' })

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({ token })
      .expect('Content-Type', /json/)
      .expect(401)

    expect(res.body.error).to.equal('invalid_token')
  })

  it('should return 401 when token taskId does not match the route param', async () => {
    const task = await TaskFactory({ state: 'funded', userId })
    const otherTask = await TaskFactory({ state: 'funded', userId })
    const token = makeToken({ taskId: otherTask.id, userId, action: 'donate' })

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({ token })
      .expect('Content-Type', /json/)
      .expect(401)

    expect(res.body.error).to.equal('invalid_token')
  })

  it('should return 500 when the task is already closed', async () => {
    const task = await TaskFactory({ state: 'closed', userId })
    const token = makeToken({ taskId: task.id, userId, action: 'donate' })

    const res = await agent
      .post(`/tasks/${task.id}/donate-to-platform-funds`)
      .send({ token })
      .expect('Content-Type', /json/)
      .expect(500)

    expect(res.body.error).to.include('already in CLOSED state')
  })
})
