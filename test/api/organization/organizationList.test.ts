import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /organizations/list', () => {
  beforeEach(async () => {
    await truncateModels(models.Project)
    await truncateModels(models.Organization)
    await truncateModels(models.User)
  })

  it('should not expose the organization owner password or email', async () => {
    const owner = await UserFactory({ password: 'super-secret-hash-source' })
    await models.Organization.create({ name: 'Org', UserId: owner.id })

    const res = await agent.get('/organizations/list').expect('Content-Type', /json/).expect(200)

    expect(res.body).to.be.an('array').with.length(1)
    expect(res.body[0].User).to.exist
    expect(res.body[0].User).to.not.have.property('password')
    expect(res.body[0].User).to.not.have.property('email')
    expect(res.body[0].User).to.not.have.property('recover_password_token')
    expect(res.body[0].User).to.not.have.property('account_id')
    expect(res.body[0].User).to.have.property('name')
  })
})
