import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory, TaskFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /projects/list', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.Project)
    await truncateModels(models.Organization)
    await truncateModels(models.User)
  })

  it('returns only the projects owned (via Organization) by the given userId', async () => {
    const owner = await UserFactory()
    const other = await UserFactory()

    const ownedOrg = await models.Organization.create({ name: 'Owned Org', UserId: owner.id })
    const ownedProject = await models.Project.create({
      name: 'Owned Project',
      OrganizationId: ownedOrg.id
    })

    const otherOrg = await models.Organization.create({ name: 'Other Org', UserId: other.id })
    await models.Project.create({ name: 'Other Project', OrganizationId: otherOrg.id })

    const res = await agent.get('/projects/list').query({ userId: owner.id }).expect(200)

    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].id).to.equal(ownedProject.id)
    expect(res.body[0].name).to.equal('Owned Project')
  })

  it("includes each project's Organization and Tasks", async () => {
    const owner = await UserFactory()
    const org = await models.Organization.create({ name: 'Gitpay Org', UserId: owner.id })
    const project = await models.Project.create({ name: 'gitpay', OrganizationId: org.id })
    await TaskFactory({ ProjectId: project.id, status: 'open', value: 50 })

    const res = await agent.get('/projects/list').query({ userId: owner.id }).expect(200)

    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].Organization.name).to.equal('Gitpay Org')
    expect(res.body[0].Tasks).to.have.lengthOf(1)
    expect(res.body[0].Tasks[0].status).to.equal('open')
  })

  it('returns all projects when no userId filter is given', async () => {
    const owner = await UserFactory()
    const org = await models.Organization.create({ name: 'Org', UserId: owner.id })
    await models.Project.create({ name: 'Project A', OrganizationId: org.id })
    await models.Project.create({ name: 'Project B', OrganizationId: org.id })

    const res = await agent.get('/projects/list').expect(200)

    expect(res.body).to.have.lengthOf(2)
  })
})
