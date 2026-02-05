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

describe('DELETE /user', () => {
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

  describe('User delete', () => {
    it('Should delete user', async () => {
      const res = await registerAndLogin(agent)
      console.log(res.statusCode, res.headers)
      const userId = res.body.id
      
      const user = await agent
        .delete(`/user/delete/`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      
      expect(user.statusCode).to.equal(200)
      expect(user.text).to.equal('1')
      const users = models.User.findAll({ where: { id: userId } })
      expect(users).to.exist
    })
  })
})
