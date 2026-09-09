import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /users?id=', () => {
  beforeEach(async () => {
    await truncateModels(models.Type)
    await truncateModels(models.User)
  })

  it('returns the public profile fields, including country/skills/openForJobs and Types', async () => {
    const user = await UserFactory({
      name: 'Contributor Test',
      country: 'BR',
      skills: 'TypeScript,React',
      openForJobs: true
    })
    const type = await models.Type.create({ name: 'contributor', label: 'Contributor' })
    await user.addType(type)

    const res = await agent.get('/users').query({ id: user.id }).expect(200)

    const [profile] = res.body
    expect(profile.id).to.equal(user.id)
    expect(profile.username).to.equal(user.username)
    expect(profile.country).to.equal('BR')
    expect(profile.skills).to.equal('TypeScript,React')
    expect(profile.openForJobs).to.equal(true)
    expect(profile.Types).to.deep.equal([{ id: type.id, name: 'contributor' }])
  })

  it('never leaks sensitive fields', async () => {
    const user = await UserFactory({ password: 'password123' })

    const res = await agent.get('/users').query({ id: user.id }).expect(200)

    const [profile] = res.body
    expect(profile.email).to.be.undefined
    expect(profile.password).to.be.undefined
    expect(profile.account_id).to.be.undefined
    expect(profile.paypal_id).to.be.undefined
    expect(profile.customer_id).to.be.undefined
  })
})
