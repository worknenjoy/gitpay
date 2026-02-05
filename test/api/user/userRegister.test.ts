import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import githubOrg from '../../data/github/github.org'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('POST /auth/register', () => {
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

  describe('register User', () => {
    it('should register and generate token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.activation_token).to.exist
      expect(res.body.email_verified).to.equal(false)
    })
    it('shouldnt register with long names', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          name: 'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name',
          email: 'teste@gmail.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.name.too.long')
    })
    it('shouldnt register with long email', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          email:
            'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com',
          password: 'teste'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.email.too.long')
    })
    it('shouldnt register with long password', async () => {
      const res = await agent
        .post('/auth/register')
        .send({
          email: 'email@test.com',
          password:
            'a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name a really llong name@email.com'
        })
        .expect('Content-Type', /json/)
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body).to.exist
      expect(res.body.message).to.equal('user.password.too.long')
    })
    it('should validate user activation token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste22222@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const activateRes = await agent
        .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
        .expect(200)
      
      expect(activateRes.statusCode).to.equal(200)
      expect(activateRes.body['email_verified']).to.equal(true)
    })
    it('should resend activation token with no existing one', async () => {
      const res = await registerAndLogin(agent)
      
      const resendRes = await agent
        .get(`/auth/resend-activation-email`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(resendRes.statusCode).to.equal(200)
      expect(resendRes.body['email_verified']).to.equal(false)
      expect(resendRes.body['activation_token']).to.exist
    })
    it('should resend user activation token', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'teste22222@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const activateRes = await agent
        .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
        .expect(200)
      
      expect(activateRes.statusCode).to.equal(200)
      expect(activateRes.body['email_verified']).to.equal(true)
    })
    it('dont allow register with the same user', async () => {
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
      expect(res.body.message).to.equal('user.exist')
    })
    it('register with user Types', async () => {
      // Ensure the types exist, then use their real IDs (avoid relying on seed order/IDs)
      const { Type } = require('../../../src/models')
      const [funding] = await Type.findOrCreate({
        where: { name: 'funding' },
        defaults: { name: 'funding' }
      })
      const [contributor] = await Type.findOrCreate({
        where: { name: 'contributor' },
        defaults: { name: 'contributor' }
      })

      const res = await agent
        .post('/auth/register')
        .send({
          email: 'teste4343434322222@gmail.com',
          password: 'test',
          Types: [String(funding.id), String(contributor.id)]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.Types).to.exist
      const typeNames = (res.body.Types || []).map((t: any) => t.name)
      expect(typeNames).to.include('funding')
      expect(typeNames).to.include('contributor')
    })
  })
})
