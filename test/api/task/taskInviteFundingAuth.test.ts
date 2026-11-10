import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'

const models = Models as any
const agent = request.agent(api)

describe('POST /tasks/:id/invite, funding, report authentication security', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
  })

  it('rejects unauthenticated invitation with 401', async () => {
    await agent
      .post('/tasks/1/invite/')
      .send({ email: 'target@example.com', name: 'Security', message: 'test' })
      .expect(401)
  })

  it('rejects unauthenticated funding invite with 401', async () => {
    await agent
      .post('/tasks/1/funding/')
      .send({ email: 'target@example.com', comment: 'test' })
      .expect(401)
  })

  it('rejects unauthenticated task report with 401', async () => {
    await agent
      .post('/tasks/1/report')
      .send({ reason: 'spam' })
      .expect(401)
  })
})
