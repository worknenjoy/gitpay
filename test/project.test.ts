import Models from '../src/models'
import { expect } from 'chai'
import request from 'supertest'
import api from '../src/server'
import { UserFactory } from './factories'

const models = Models as any
const agent = request.agent(api)

xdescribe('Projects', () => {
  describe('Models', () => {
    it('create', async () => {
      const p = await models.Project.create({ name: 'Foo Project' })
      expect(p.name).to.equal('Foo Project')
    })
    xit('create and add task to a project and organization', async () => {
      const u = await UserFactory({ email: 'foo@mail.com' })
      const o = await models.Organization.create({ name: 'Foo Organization', UserId: u.id })
      const p = await o.createProject({ name: 'Foo Project' })
      const pt = await p.createTask({ url: 'https://task.com', UserId: u.id })
      
      expect(p.name).to.equal('Foo Project')
      expect(pt.url).to.equal('https://task.com')
      expect(pt.ProjectId).to.exist
      expect(p.OrganizationId).to.exist
    })
  })
})
