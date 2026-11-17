import nock from 'nock'
import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import jwt from 'jsonwebtoken'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import githubOrg from '../../data/github/github.org.json'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('GET /auth/social', () => {
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

  describe('login User social networks', () => {
    it('should user wrong authentication', async () => {
      const res = await agent
        .get('/authenticated')
        .set('authorization', 'Bearer token-123') // 1) using the authorization header
        .expect(401)

      expect(res.statusCode).to.equal(401)
    })

    it('should user google', async () => {
      const res = await agent
        .get('/authorize/google')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)

      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include(
        'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgoogle&scope=email&client_id='
      )
    })
    it('should user bitbucket', async () => {
      const res = await agent
        .get('/authorize/bitbucket')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)

      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include('https://bitbucket.org/site/oauth2/authorize')
    })
    it('should user login with github', async () => {
      const res = await agent
        .get('/authorize/github')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect(302)

      expect(res.statusCode).to.equal(302)
      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub&scope=user%3Aemail%2Cpublic_repo&client_id='
      )
    })
    xit('should callback after authorize on github', async () => {
      const res = await agent
        .get('/callback/github')
        .send({ scope: ['user:email'] })
        .expect(200)

      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate%3FuserId%3Dundefined%26url%3Dundefined&scope=repo&client_id='
      )
    })
    it('should not ask permissions with github to access private issue without authentication', async () => {
      await agent
        .get('/authorize/github/private')
        .query({ userId: 2, url: 'https://github.com/alexanmtz/project/issues/2' })
        .expect(403)
    })
    it('should user ask permissions with github to access private issue with a signed state', async () => {
      const user = await registerAndLogin(agent)
      const token = user.headers.authorization.replace(/Bearer\s+/, '')
      const url = 'https://github.com/alexanmtz/project/issues/2'
      const res = await agent.get('/authorize/github/private').query({ url, token }).expect(302)

      expect(res.headers.location).to.include(
        'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fgithub%2Fprivate&scope=repo&state='
      )
      const state = new URL(res.headers.location).searchParams.get('state') as string
      const decoded: any = jwt.verify(state, process.env.SECRET_PHRASE as string)
      expect(decoded.userId).to.equal(user.body.id)
      expect(decoded.url).to.equal(url)
    })
  })
})
