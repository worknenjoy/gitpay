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

describe('POST /auth/login', () => {
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

  describe('login User Local', () => {
    it('should user local', async () => {
      await agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .type('form')
        .expect('Content-Type', /json/)

      const res = await agent
        .post('/authorize/local')
        .send({ username: 'teste@gmail.com', password: 'teste' })
        .type('form')
        .expect(302)

      expect(res.statusCode).to.equal(302)
      expect(res.text).to.include('token')
    })
  })
})
