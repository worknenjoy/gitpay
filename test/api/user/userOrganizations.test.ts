import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import githubOrg from '../../data/github/github.org.json'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('User Organizations', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  xdescribe('user organizations', () => {
    xit('should create organization and associate with an user', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)

      const res = await register(agent, {
        email: 'test_user_organizations_create@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const UserId = res.body.id

      const loginRes = await login(agent, {
        email: 'test_user_organizations_create@gmail.com',
        password: 'test'
      })

      await agent
        .post(`/organizations/create`)
        .send({ UserId, name: 'test' })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      const orgs = await agent
        .get(`/user/organizations`)
        .send({ id: UserId })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(orgs.statusCode).to.equal(200)
      expect(orgs.body[0].name).to.equal('test')
      expect(orgs.body[0].imported).to.equal(true)
    })
    xit('should retrieve user github organizations', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)

      const res = await register(agent, {
        email: 'test_user_organizations@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const userId = res.body.id

      const loginRes = await login(agent, {
        email: 'test_user_organizations@gmail.com',
        password: 'test'
      })

      const orgs = await agent
        .get(`/user/organizations`)
        .send({ id: userId })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(orgs.statusCode).to.equal(200)
      expect(orgs.body[0].name).to.equal('test')
      expect(orgs.body[0].imported).to.equal(false)
    })
    xit('should check if that organizations exist, if exist return true if already imported', async () => {
      nock('https://api.github.com')
        .get(
          `/users/test/orgs?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}`
        )
        .reply(200, githubOrg)

      const res = await register(agent, {
        email: 'test_user_organizations_exist@gmail.com',
        username: 'test',
        password: 'test',
        provider: 'github'
      })
      const userId = res.body.id

      const loginRes = await login(agent, {
        email: 'test_user_organizations_exist@gmail.com',
        password: 'test'
      })

      const user = await agent
        .get(`/user/organizations`)
        .send({ id: userId, organization: 'foo' })
        .set('Authorization', loginRes.headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body).to.equal(false)
    })
  })
})
