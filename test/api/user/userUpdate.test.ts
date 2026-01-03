import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import { registerAndLogin, truncateModels } from '../../helpers'
import Models from '../../../src/models'

const agent = request.agent(api)
const models = Models as any
describe('update User', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })
  it('should update user name', async () => {
    const res = await registerAndLogin(agent)
    const { headers, body: currentUser } = res || {}

    const user = await agent
      .put('/user/update')
      .send({ name: 'test' })
      .set('Authorization', headers.authorization)
      .expect(200)

    expect(user.statusCode).to.equal(200)
    expect(user.body.name).to.equal('test')
    expect(user.body.email).to.equal(currentUser.email)
  })

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
