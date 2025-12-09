import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import models from '../../../src/models'

const agent = request.agent(api) as any
const currentModels = models as any

describe('Current User Info', () => {
  beforeEach(async () => {
    await truncateModels(currentModels.User)
    await truncateModels(currentModels.Task)
  })

  it('should fetch initial user info by userId', async () => {
    const user = await registerAndLogin(agent)
    const { headers, body } = user || {}
    const res = await agent
      .get(`/dashboard`)
      .set('Authorization', headers['authorization'])
      .expect(200)

    expect(res.status).to.equal(200)
    expect(res.body.issues.total).to.equal(0)
    expect(res.body.payments.total).to.equal(0)
  })
  it('should return 403 if authorization header is invalid', async () => {
    const res = await agent
      .get(`/dashboard`)
      .set('Authorization', 'wrong header')
      .expect(403)
    expect(res.status).to.equal(403)
    expect(res.text).to.equal('{"errors":["Failed to authenticate token"]}')
  })
  it('should fetch user info after creating tasks and payments', async () => {
    const user = await registerAndLogin(agent)
    const { headers, body: currentUser } = user || {}

    await currentModels.Task.bulkCreate([
      { title: 'Task 1', status: 'open', userId: currentUser.id },
      { title: 'Task 2', status: 'closed', userId: currentUser.id }
    ])

    await currentModels.Order.bulkCreate([
      { amount: 100, status: 'succeeded', userId: currentUser.id },
      { amount: 50, status: 'failed', userId: currentUser.id }
    ])

    const res = await agent
      .get(`/dashboard`)
      .set('Authorization', headers['authorization'])
      .expect(200)

    expect(res.status).to.equal(200)
    expect(res.body.issues.total).to.equal(2)
    expect(res.body.issues.open).to.equal(1)
    expect(res.body.issues.closed).to.equal(1)
    expect(res.body.payments.total).to.equal(2)
    expect(res.body.payments.successful).to.equal(1)
    expect(res.body.payments.failed).to.equal(1)
  })
})



