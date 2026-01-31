import { expect } from 'chai'
import request from 'supertest'
import api from '../src/server'
import Models from '../src/models'
import { register, login } from './helpers'

const models = Models as any
const agent = request.agent(api)

xdescribe('Organizations', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {}, truncate: true, cascade: true })

    await models.Organization.destroy({ where: {}, truncate: true, cascade: true })
  })

  xdescribe('findAll Organizations', () => {
    it('should find user', async () => {
      const res = await agent
        .get('/organizations')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })
  })

  xdescribe('register Organization', () => {
    it('should register new organization with a user', async () => {
      const res = await register(agent, {
        email: 'test_register_organization@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })

      const UserId = res.body.id
      const user = await login(agent, {
        email: 'test_register_organization@gmail.com',
        password: 'test'
      })

      const org = await agent
        .post(`/organizations/create`)
        .send({ UserId, name: 'foo' })
        .set('Authorization', user.headers.authorization)
        .expect(200)

      expect(org.statusCode).to.equal(200)
      expect(org.body.name).to.equal('foo')
    })

    xit('dont allow register with the same organization', async () => {
      await agent
        .post('/auth/register')
        .send({ email: 'teste43434343@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)

      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste43434343@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(403)

      expect(res.statusCode).to.equal(403)
      expect(res.body.error).to.equal('user.exist')
    })
  })
})
