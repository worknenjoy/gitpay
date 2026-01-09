import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { register, registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import account from '../../data/stripe/account.json'

const agent = request.agent(api)
const models = Models as any

describe('UPDATE /user', () => {
  describe('update User', () => {
    beforeEach(async () => {
      await truncateModels(models.User)
    })
    afterEach(async () => {
      nock.cleanAll()
    })
    it('should update user name', async () => {
      const res = await registerAndLogin(agent)
      const { headers, body: currentUser } = res || {}

      const user = await agent
        .put('/user')
        .send({ name: 'new test user' })
        .set('Authorization', headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.name).to.equal('new test user')
      expect(user.body.email).to.equal(currentUser.email)
      const updatedUser = await models.User.findOne({ where: { id: currentUser.id } })
      expect(updatedUser.name).to.equal('new test user')
    })
    it('should not update email', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/user')
        .send({ email: 'newemail@example.com' })
        .set('Authorization', headers.authorization)
        .expect(500)
      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.update.cannot_update_email')

      const userAfterTransaction = await models.User.findOne({ where: { id: res?.body.id } })
      expect(userAfterTransaction.email).to.equal(res?.body.email)
    })
  })
})
