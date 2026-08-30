import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { TaskFactory, UserFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /users/:id/maintained-projects', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.Project)
    await truncateModels(models.Organization)
    await truncateModels(models.User)
  })

  it('should return an empty array for a user with no organizations', async () => {
    const user = await UserFactory()

    const res = await agent
      .get(`/users/${user.id}/maintained-projects`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('should return projects with org name and per-project rollups', async () => {
    const maintainer = await UserFactory()
    const org = await models.Organization.create({ name: 'worknenjoy', UserId: maintainer.id })
    const project = await org.createProject({
      name: 'gitpay',
      repo: 'gitpay',
      description: 'Payment platform for open-source work.'
    })

    await TaskFactory({ userId: maintainer.id, ProjectId: project.id, status: 'open', value: 40 })
    await TaskFactory({
      userId: maintainer.id,
      ProjectId: project.id,
      status: 'closed',
      value: 60,
      paid: true
    })

    const res = await agent.get(`/users/${maintainer.id}/maintained-projects`).expect(200)

    expect(res.body).to.be.an('array').with.length(1)
    expect(res.body[0]).to.deep.equal({
      id: project.id,
      name: 'gitpay',
      repo: 'gitpay',
      description: 'Payment platform for open-source work.',
      org: 'worknenjoy',
      organizationId: org.id,
      openBountyCount: 1,
      totalPaid: 60,
      issuesCount: 2
    })
  })
})
