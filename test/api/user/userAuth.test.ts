import { expect } from 'chai'
import nock from 'nock'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'
import UserMail from '../../../src/modules/mail/user'
import account from '../../data/stripe/account.json'
import sinon from 'sinon'

const agent = request.agent(api)
const models = Models as any

describe('AUTH /user', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })
  afterEach(async () => {
    nock.cleanAll()
    sinon.restore()
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
      
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers, body } = res || {}

      const newEmailChangeRequest = sinon
        .stub(UserMail as any, 'changeEmailNotification')
        .resolves(true)

      const oldEmailAlertStub = sinon
        .stub(UserMail as any, 'alertOldEmailAboutChange')
        .resolves(true)


      const newEmail = 'newemail@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(200)

      expect(user.statusCode).to.equal(200)
      expect(user.body.id).to.equal(body.id)

      const updatedUser = await models.User.findByPk(body.id)
      expect(updatedUser.pending_email_change).to.equal(newEmail)
      expect(updatedUser.email).to.not.equal(newEmail)
      expect(updatedUser.email_change_token).to.be.a('string')
      expect(updatedUser.email_change_token_expires_at).to.be.instanceOf(Date)
      expect(updatedUser.email_change_requested_at).to.be.instanceOf(Date)
      expect(updatedUser.email_change_attempts).to.equal(1)

      const mailArgsChangeRequest = newEmailChangeRequest.firstCall.args
      const mailArgsOldEmailAlert = oldEmailAlertStub.firstCall.args

      expect(mailArgsOldEmailAlert[0].dataValues).to.deep.equal(updatedUser.dataValues)
      expect(mailArgsChangeRequest[0].dataValues).to.deep.equal(updatedUser.dataValues)

    })
    it('should not change email with incorrect current password', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers } = res || {}

      const newEmail = 'newemail@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'wrongpassword', confirmCurrentPassword: 'wrongpassword' })
        .set('Authorization', headers.authorization)
        .expect(500)

      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.change_email.current_password_incorrect')
    })

    it('should not change email if parameters are missing', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers } = res || {}

      const newEmail = 'newemail@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test' }) // missing confirmCurrentPassword
        .set('Authorization', headers.authorization)
        .expect(500)

      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.change_email.missing_parameters')
    })
    it('should not change email if user signed up with provider', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', provider: 'github' })
      const { headers } = res || {}

      const newEmail = 'newemail@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(500)

      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.change_email.cannot_change_email_for_provider')
    })
    it('should not change email if user already exist with new email', async () => {
      await models.User.create({ email: 'existing-email@example.com', password: 'test' })
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers } = res || {}

      const newEmail = 'existing-email@example.com'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(500)

      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.change_email.email_already_in_use')
    })
    it('should not change email if email is invalid', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers } = res || {}

      const invalidEmail = 'invalid-email'
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail: invalidEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(500)

      expect(user.statusCode).to.equal(500)
      expect(user.body.error).to.equal('user.change_email.invalid_email')
    })
  })
  describe('Confirm change email', () => {
    it('should confirm email change with correct token', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test'})
      const { headers, body } = res || {}

      const newEmailChangeRequest = sinon
        .stub(UserMail as any, 'confirmedChangeUserEmail')
        .resolves(true)

      const oldEmailAlertStub = sinon
        .stub(UserMail as any, 'confirmedChangeUserEmailOldEmail')
        .resolves(true)

      const newEmail = 'new@example.com'
      await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(200)

      const updatedUser = await models.User.findByPk(body.id)

      const confirmResponse = await agent
        .get('/auth/change-email/confirm')
        .query({ token: updatedUser.email_change_token })
        .set('Authorization', headers.authorization)
        .expect(200)
      
      expect(confirmResponse.statusCode).to.equal(200)
      expect(confirmResponse.body.email).to.equal(newEmail)

      const confirmedUser = await models.User.findByPk(body.id)
      expect(confirmedUser.email).to.equal(newEmail)
      expect(confirmedUser.pending_email_change).to.be.null
      expect(confirmedUser.email_change_token).to.be.null
      expect(confirmedUser.email_change_token_expires_at).to.be.null
      expect(confirmedUser.email_change_requested_at).to.be.null
      expect(confirmedUser.email_change_attempts).to.equal(0)

      const mailArgsChangeRequest = newEmailChangeRequest.firstCall.args
      const mailArgsOldEmailAlert = oldEmailAlertStub.firstCall.args

      expect(mailArgsChangeRequest[0].user.id).to.deep.equal(confirmedUser.id)
      expect(mailArgsOldEmailAlert[0].user.id).to.deep.equal(updatedUser.id)
    })

    it('should confirm email change with a connected account', async () => {
      nock('https://api.stripe.com/v1')
        .post('/accounts/acct_1EYDS6IbQaEige6l')
        .reply(200, account)

      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test', account_id: 'acct_1EYDS6IbQaEige6l'})
      const { headers, body } = res || {}

      const newEmailChangeRequest = sinon
        .stub(UserMail as any, 'confirmedChangeUserEmail')
        .resolves(true)

      const oldEmailAlertStub = sinon
        .stub(UserMail as any, 'confirmedChangeUserEmailOldEmail')
        .resolves(true)

      const newEmail = 'new@example.com'
      await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(200)

      const updatedUser = await models.User.findByPk(body.id)

      const confirmResponse = await agent
        .get('/auth/change-email/confirm')
        .query({ token: updatedUser.email_change_token })
        .set('Authorization', headers.authorization)
        .expect(200)
      
      expect(confirmResponse.statusCode).to.equal(200)
      expect(confirmResponse.body.email).to.equal(newEmail)

      const confirmedUser = await models.User.findByPk(body.id)
      expect(confirmedUser.email).to.equal(newEmail)
      expect(confirmedUser.pending_email_change).to.be.null
      expect(confirmedUser.email_change_token).to.be.null
      expect(confirmedUser.email_change_token_expires_at).to.be.null
      expect(confirmedUser.email_change_requested_at).to.be.null
      expect(confirmedUser.email_change_attempts).to.equal(0)

      const mailArgsChangeRequest = newEmailChangeRequest.firstCall.args
      const mailArgsOldEmailAlert = oldEmailAlertStub.firstCall.args

      expect(mailArgsChangeRequest[0].user.id).to.deep.equal(confirmedUser.id)
      expect(mailArgsOldEmailAlert[0].user.id).to.deep.equal(updatedUser.id)
    
    })
    it('should not confirm email change if stripe account fails', async () => {
      nock('https://api.stripe.com/v1')
        .post('/accounts/acct_failedupdate')
        .reply(500, { error: 'user.change_email.stripe_error' })

      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test', account_id: 'acct_failedupdate'})
      const { headers, body } = res || {}

      const newEmail = 'new@example.com'
      
      const user = await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(200)

      const confirmChangeUser = await agent
        .get('/auth/change-email/confirm')
        .query({ token: user.body.email_change_token })
        .set('Authorization', headers.authorization)
        .expect(500)
      
      expect(confirmChangeUser.statusCode).to.equal(500)
      expect(confirmChangeUser.body.error).to.equal('user.change_email.stripe_error')

      const confirmedUser = await models.User.findByPk(body.id)
      expect(confirmedUser.email).to.equal('oldemail@example.com')
    })  
    it('it should not confirm email change if another account with the new email exist', async () => {
      const res = await registerAndLogin(agent, { email: 'oldemail@example.com', password: 'test' })
      const { headers, body } = res || {}

      const newEmail = 'new@example.com'
      await agent
        .post('/auth/change-email')
        .send({ newEmail, currentPassword: 'test', confirmCurrentPassword: 'test' })
        .set('Authorization', headers.authorization)
        .expect(200)

      const updatedUser = await models.User.findByPk(body.id)

      await models.User.create({ email: 'new@example.com' })
      
      const confirmResponse = await agent
        .get('/auth/change-email/confirm')
        .query({ token: updatedUser.email_change_token })
        .set('Authorization', headers.authorization)
        .expect(500)
      
      expect(confirmResponse.statusCode).to.equal(500)
      expect(confirmResponse.body.error).to.equal('user.confirm_change_email.email_already_in_use')

      const confirmedUser = await models.User.findByPk(body.id)
      expect(confirmedUser.email).to.equal('oldemail@example.com')
    })
  })
})