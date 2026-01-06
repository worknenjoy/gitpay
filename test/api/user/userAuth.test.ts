import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import UserMail from '../../../src/modules/mail/user'
import sinon from 'sinon/lib/sinon.js'

const agent = request.agent(api)
const models = Models as any

describe('AUTH /user', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })
  afterEach(async () => {
    nock.cleanAll()
  })
  describe('change password', () => {
    it('should not update if old password is incorrect (too small)', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/auth/change-password')
        .send({ old_password: '1232', password: '' })
        .set('Authorization', headers.authorization)
        .expect(400)

      expect(user.statusCode).to.equal(400)
      expect(user.body.error).to.equal('user.password.current.incorrect.too_short')
    })

    it('should not update if password is the same', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/auth/change-password')
        .send({ old_password: 'test12345678', password: 'test12345678' })
        .set('Authorization', headers.authorization)
        .expect(400)

      expect(user.statusCode).to.equal(400)
      expect(user.body.error).to.equal('user.password.incorrect.same')
    })

    it('should update if password is correct', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/auth/change-password')
        .send({ old_password: 'test12345678', password: 'test12345678910' })
        .set('Authorization', headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body).to.equal(true)
    })

    it('should not update if new password is too small', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/auth/change-password')
        .send({ old_password: 'test12345678', password: 'test' })
        .set('Authorization', headers.authorization)
        .expect(400)

      expect(user.statusCode).to.equal(400)
      expect(user.body.error).to.equal('user.password.new.incorrect.too_short')
    })

    it('should not update if new password is too big', async () => {
      const res = await registerAndLogin(agent)
      const { headers } = res || {}

      const user = await agent
        .put('/auth/change-password')
        .send({
          old_password: 'test12345678',
          password:
            'test12345678test12345678test12345678test12345678test12345678test12345678test12345678'
        })
        .set('Authorization', headers.authorization)
        .expect(400)

      expect(user.statusCode).to.equal(400)
      expect(user.body.error).to.equal('user.password.new.incorrect.too_long')
    })
  })
  describe('reset password', () => {
    it('should reset password from the right token', async () => {
      const res = await registerAndLogin(agent, { recover_password_token: '123' })
      const { headers } = res || {}

      const user = await agent
        .put('/auth/reset-password')
        .send({ password: '', token: '123' })
        .set('Authorization', headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.text).to.equal('successfully change password')
    })

    it('should not reset password from the wrong token', async () => {
      const res = await registerAndLogin(agent, { recover_password_token: '1234' })
      const { headers } = res || {}

      const user = await agent
        .put('/auth/reset-password')
        .send({ password: '', token: '123' })
        .set('Authorization', headers.authorization)
        .expect(401)

      expect(user.statusCode).to.equal(401)
    })
  })
  describe('change email', () => {
    it('should change email for authenticated user', async () => {
      
      const res = await registerAndLogin(agent)
      const { headers, body } = res || {}

      const mailStub = sinon
        .stub(UserMail as any, 'newDisputeCreatedForPaymentRequest')
        .resolves(true)


      const newEmail = 'newemail@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail })
        .set('Authorization', headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.message).to.equal('Email updated successfully')

      const updatedUser = await models.User.findByPk(body.id)
      expect(updatedUser.pending_email_change).to.equal(newEmail)
      expect(updatedUser.email).to.not.equal(newEmail)
      expect(updatedUser.email_change_token).to.be.a('string')
      expect(updatedUser.email_change_token_expires_at).to.be.instanceOf(Date)
      expect(updatedUser.email_change_requested_at).to.be.instanceOf(Date)
      expect(updatedUser.email_change_attempts).to.equal(1)

      const mailArgs = mailStub.firstCall.args
      expect(mailArgs[0]).to.equal(updatedUser)

    })
  })
})