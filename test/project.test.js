const models = require('../models')
const expect = require('chai').expect
const request = require('supertest')
const api = require('../server')
const agent = request.agent(api)

describe("Projects", () => {
  describe("Models", () => {
    it("create", (done) => {
      models.Project.create({name: 'Foo Project'}).then(p => {
        expect(p.name).to.equal('Foo Project');
        done()
      }).catch(done)
    })
    it("create and add task to a project and organization", (done) => {
      models.User.create({email: 'foo@mail.com'}).then(u => {        
        models.Organization.create({name: 'Foo Organization', UserId: u.id}).then(o => {
          o.createProject({name: 'Foo Project'}).then(p => {
            p.createTask({url: 'https://task.com', UserId: u.id}).then(pt => {
              expect(p.name).to.equal('Foo Project');
              expect(pt.url).to.equal('https://task.com')
              expect(pt.ProjectId).to.exist
              expect(p.OrganizationId).to.exist
              done()
            }).catch(done)
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })
  })
})