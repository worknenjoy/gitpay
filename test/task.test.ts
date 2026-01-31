import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import api from '../src/server'
import Models from '../src/models'
import { registerAndLogin, register, login, truncateModels } from './helpers'
import nock from 'nock'
import secrets from '../src/config/secrets'
import spies from 'chai-spies'
import AssignMail from '../src/modules/mail/assign'
import TaskMail from '../src/modules/mail/task'
import { taskUpdate } from '../src/modules/tasks/taskUpdate'

const sampleIssue = require('./data/github/github.issue.create')
const getSingleIssue = require('./data/github/github.issue.get')
const getIssueError = require('./data/github/github.issue.error')
const getSingleRepo = require('./data/github/github.repository.get')

const models = Models as any
const agent = request.agent(api)

const nockAuth = () => {
  nock('https://github.com')
    .persist()
    .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
    .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
    .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay/issues/1080')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, getSingleIssue.issue)

  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, getSingleRepo.repo)

  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay/languages')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, { JavaScript: 100000, HTML: 50000 })
}

const nockAuthLimitExceeded = () => {
  nock('https://github.com')
    .persist()
    .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
    .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
    .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay/issues/1080')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(403, getIssueError.limitException)

  nock('https://api.github.com')
    .persist()
    .get('/repos/worknenjoy/gitpay')
    .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
    .reply(200, getSingleRepo.repo)
}

describe('tasks', () => {
  const createTask = async (authorizationHeader: string, params?: any) => {
    const res = await agent
      .post('/tasks/create/')
      .send(params ? params : { url: 'https://github.com/worknenjoy/truppie/issues/99' })
      .set('Authorization', authorizationHeader)
    return res.body
  }

  const buildTask = (params: any) => {
    const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
    return models.Task.create({
      userId: params.userId,
      url: github_url,
      provider: 'github',
      title: params.title || 'Issue 76!'
    })
  }

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

  xdescribe('list tasks', () => {
    it('should list tasks', async () => {
      const res = await agent
        .get('/tasks/list')
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
    })
  })

  xdescribe('task history', () => {
    it('should create a new task and register on task history', async () => {
      const res = await registerAndLogin(agent)
      const taskRes = await agent
        .post('/tasks/create/')
        .send({ url: 'https://github.com/worknenjoy/truppie/issues/99' })
        .set('Authorization', res.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)
      
      const history = await models.History.findOne({ where: { TaskId: taskRes.body.id } })
      expect(history).to.exist
      expect(history.TaskId).to.equal(taskRes.body.id)
      expect(history.type).to.equal('create')
      expect(history.fields).to.have.all.members(['url', 'userId'])
      expect(history.oldValues).to.have.all.members([null, null])
      expect(history.newValues).to.have.all.members([
        'https://github.com/worknenjoy/truppie/issues/99',
        `${taskRes.body.userId}`
      ])
    })

    xit('should sync with a succeeded order and track history', async () => {
      const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
      const order = await task.createOrder({
        source_id: '12345',
        currency: 'BRL',
        amount: 256,
        status: 'succeeded'
      })
      
      await agent
        .get(`/tasks/${task.dataValues.id}/sync/value`)
        .expect('Content-Type', /json/)
        .expect(200)
      
      const histories = await models.History.findAll({
        where: { TaskId: task.dataValues.id },
        order: [['id', 'DESC']]
      })
      
      expect(histories.length).to.equal(2)
      const history = histories[0]
      expect(history).to.exist
      expect(history.TaskId).to.equal(task.dataValues.id)
      expect(history.type).to.equal('update')
      expect(history.fields).to.have.all.members(['value'])
      expect(history.oldValues).to.have.all.members([null])
      expect(history.newValues).to.have.all.members(['256'])
    })
  })

  describe('Task crud', () => {
    it('should create a new task with projects and organizations', async () => {
      nockAuth()
      const res = await registerAndLogin(agent)
      const task = await createTask(res.headers.authorization, {
        url: 'https://github.com/worknenjoy/gitpay/issues/1080'
      })
      
      expect(task.url).to.equal('https://github.com/worknenjoy/gitpay/issues/1080')
    })

    it('should give error on update if the task already exists', async () => {
      nockAuth()
      const res = await registerAndLogin(agent)
      await createTask(res.headers.authorization, {
        url: 'https://github.com/worknenjoy/gitpay/issues/1080',
        provider: 'github'
      })
      
      const task = await createTask(res.headers.authorization, {
        url: 'https://github.com/worknenjoy/gitpay/issues/1080',
        provider: 'github'
      })
      
      expect(task.errors).to.exist
      expect(task.errors[0].message).to.equal('url must be unique')
    })

    it('should give an error on create if the issue build responds with limit exceeded', async () => {
      nockAuthLimitExceeded()
      const res = await registerAndLogin(agent)
      const task = await createTask(res.headers.authorization, {
        url: 'https://github.com/worknenjoy/gitpay/issues/1080',
        provider: 'github'
      })
      
      expect(task.error).exist
      expect(task.error).to.contain('API rate limit exceeded')
    })

    it('should not raise an error on fetch if the issue build responds with limit exceeded', async () => {
      const res = await registerAndLogin(agent)
      const task = await createTask(res.headers.authorization, {
        url: 'https://github.com/worknenjoy/gitpay/issues/1080',
        provider: 'github'
      })
      
      nockAuthLimitExceeded()
      const fetchRes = await agent.get(`/tasks/fetch/${task.id}`)
      expect(fetchRes.body).exist
      expect(fetchRes.body.id).to.equal(task.id)
    })

    xit('should try to create an invalid task', async () => {
      const res = await registerAndLogin(agent)
      const taskRes = await agent
        .post('/tasks/create/')
        .send({ url: 'https://github.com/worknenjoy/truppie/issues/test', provider: 'github' })
        .set('Authorization', res.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(400)
      
      expect(taskRes.statusCode).to.equal(400)
    })

    xit('should create a new task with one member', async () => {
      const user = await register(agent)
      const res = await login(agent)
      const taskRes = await agent
        .post('/tasks/create/')
        .send({
          url: 'https://github.com/worknenjoy/truppie/issues/99',
          provider: 'github',
          userId: user.body.id
        })
        .set('Authorization', res.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(taskRes.statusCode).to.equal(200)
      expect(taskRes.body).to.exist
      expect(taskRes.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99')
    })

    xit('should invite for a task', async () => {
      const res = await registerAndLogin(agent)
      const task = await createTask(res.headers.authorization)
      const inviteRes = await agent
        .post(`/tasks/${task.id}/invite/`)
        .send({
          email: 'https://github.com/worknenjoy/truppie/issues/99',
          message: 'a test invite'
        })
        .expect(200)
      
      expect(inviteRes.statusCode).to.equal(200)
      expect(inviteRes.body).to.exist
    })

    xit('should message user interested to solve an issue', async () => {
      const firstUser = await register(agent, { email: 'firstUser email', password: 'teste' })
      const user = await agent
        .post('/auth/register')
        .send({ email: 'teste_order_declined@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = user.body.id
      const res = await login(agent, { email: 'firstUser email', password: 'teste' })
      const task = await buildTask({
        userId: userId,
        Assigns: [{ userId }]
      })
      
      const assign = await task.createAssign({ userId: userId })
      chai.use(spies)
      const mailSpySuccess = chai.spy.on(AssignMail, 'messageInterested')
      
      const messageRes = await agent
        .post(`/tasks/${task.id}/message/`)
        .send({
          interested: assign.id,
          message: 'Hey, are you prepared to work on this?'
        })
        .set('Authorization', res.headers.authorization)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(messageRes.statusCode).to.equal(200)
      expect(messageRes.body).to.exist
      expect(messageRes.body.url).to.equal(
        'https://github.com/worknenjoy/truppie/issues/76'
      )
      expect(mailSpySuccess).to.have.been.called()
    })

    xit('should receive code on the platform from github auth to the redirected url for private tasks but invalid code', async () => {
      const res = await agent
        .get(
          '/callback/github/private/?userId=1&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7'
        )
        .expect(401)
      
      expect(res.statusCode).to.equal(401)
      expect(res.body.error).to.equal('bad_verification_code')
      expect(res.body).to.exist
    })

    it('should receive code on the platform from github auth to the redirected url for private tasks with a valid code', async () => {
      nock('https://github.com')
        .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
        .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
        .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
      nock('https://api.github.com')
        .get('/repos/alexanmtz/festifica/issues/1')
        .reply(200, sampleIssue.issue)
        .get('/users/alexanmtz')
        .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
        .reply(200, { email: 'test@gmail.com' })
      
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(registerRes.statusCode).to.equal(200)
      expect(registerRes.body).to.exist
      const userId = registerRes.body.id
      
      const callbackRes = await agent
        .get(
          `/callback/github/private/?userId=${userId}&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7`
        )
        .expect(302)
      
      expect(callbackRes.statusCode).to.equal(302)
    })

    describe('task fetch', () => {
      beforeEach(async () => {
        nock('https://api.github.com')
          .persist()
          .get('/users/worknenjoy')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleRepo.repo)
      })

      it('should fetch task', async () => {
        const github_url = 'https://github.com/worknenjoy/gitpay/issues/1080'

        nock('https://github.com')
          .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
          .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
          .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay/issues/1080')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleIssue.issue)
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleRepo.repo)

        const task = await models.Task.build({ url: github_url, provider: 'github', title: 'foo' }).save()
        const res = await agent
          .get(`/tasks/fetch/${task.dataValues.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
        
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body.metadata.id).to.equal('1080')
        expect(res.body.url).to.equal(github_url)
        expect(res.body.title).to.equal('Improving testing code')
        expect(res.body.status).to.equal('open')
        expect(res.body.metadata).to.exist
        expect(res.body.metadata.user).to.equal('worknenjoy')
        expect(res.body.metadata.company).to.equal('worknenjoy')
        expect(res.body.metadata.projectName).to.equal('gitpay')
        expect(res.body.metadata.issue.url).to.equal(
          'https://api.github.com/repos/worknenjoy/gitpay/issues/1080'
        )
      })

      it('should fetch task and not sync status in_progress on Gitpay and open on Github', async () => {
        const github_url = 'https://github.com/worknenjoy/gitpay/issues/1080'

        nock('https://github.com')
          .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
          .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
          .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay/issues/1080')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleIssue.issue)
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleRepo.repo)

        const task = await models.Task.build({ url: github_url, provider: 'github', title: 'foo' }).save()
        await models.Task.update({ status: 'in_progress' }, { where: { id: task.dataValues.id } })
        
        const res = await agent
          .get(`/tasks/fetch/${task.dataValues.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
        
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body.metadata.id).to.equal('1080')
        expect(res.body.status).to.equal('in_progress')
      })

      it('should fetch task and sync status in_progress on Gitpay and closed on Github', async () => {
        const github_url = 'https://github.com/worknenjoy/gitpay/issues/1080'

        const closedIssue = getSingleIssue.issue
        closedIssue.state = 'closed'

        nock('https://github.com')
          .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
          .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
          .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay/issues/1080')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, closedIssue)
        nock('https://api.github.com')
          .persist()
          .get('/repos/worknenjoy/gitpay')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleRepo.repo)

        const task = await models.Task.build({ url: github_url, provider: 'github', title: 'foo' }).save()
        await models.Task.update({ status: 'in_progress' }, { where: { id: task.dataValues.id } })
        
        const res = await agent
          .get(`/tasks/fetch/${task.dataValues.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
        
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body.metadata.id).to.equal('1080')
        expect(res.body.status).to.equal('closed')
      })
    })

    xit('should update task value', async () => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'

      nock('https://github.com')
        .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
        .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
        .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
      nock('https://api.github.com')
        .get('/repos/worknenjoy/truppie/issues/98')
        .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
        .reply(200, sampleIssue.issue)

      const task = await models.Task.build({ url: github_url, value: 0 }).save()
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200 })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body).to.exist
      expect(res.body.value).to.equal('200')
    })

    xit('should update task status', async () => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'

      nock('https://github.com')
        .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
        .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
        .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
      nock('https://api.github.com')
        .get('/repos/worknenjoy/truppie/issues/98')
        .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
        .reply(200, sampleIssue.issue)

      const task = await models.Task.build({ url: github_url }).save()
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, status: 'in_progress' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_progress')
    })

    xit('should update task with associated order no logged users', async () => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'
      const order = {
        source_id: 'tok_visa',
        currency: 'BRL',
        amount: 200,
        email: 'foo@mail.com'
      }

      const task = await models.Task.build({ url: github_url, provider: 'github' }).save()
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200, Orders: [order] })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body).to.exist
      expect(res.body.value).to.equal('200')
    })

    xit('should update task with associated order declined', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'teste_order_declined@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      const order = {
        source_id: 'tok_chargeDeclined',
        currency: 'BRL',
        amount: 200,
        email: 'foo@mail.com',
        userId: userId
      }

      const task = await models.Task.build({ url: github_url, provider: 'github' }).save()
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200, Orders: [order] })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.code).to.equal('card_declined')
    })

    xit('should update task with associated user assigned', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'teste_task_user_assigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const res = await agent
        .put('/tasks/update')
        .send({
          id: task.dataValues.id,
          value: 200,
          Offers: [{ userId: userId, value: 100 }],
          Assigns: [{ userId: userId }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
    })

    xit('should update task with associated user offer', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'teste_user_assigned_and_offer@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const res = await agent
        .put('/tasks/update')
        .send({
          id: task.dataValues.id,
          value: 200,
          Assigns: [{ userId: userId }],
          Offers: [{ userId: userId, value: 100 }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
    })

    xit('should accept offer', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'teste_user_accept_work@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/77777'

      const task = await models.Task.build({ url: github_url, userId: userId }).save()
      const updateRes = await agent
        .put('/tasks/update')
        .send({
          id: task.dataValues.id,
          value: 200,
          Assigns: [{ userId: userId }],
          Offers: [{ userId: userId, value: 100 }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(updateRes.body.value).to.equal('200')
      
      const acceptRes = await agent
        .get(`/tasks/${task.dataValues.id}/accept/${1}`)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(acceptRes.body.value).to.equal('200')
    })

    xit('should update task with members and roles', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'test23232fafa32@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const role = await models.Role.build({ name: 'admin', label: 'admin' }).save()
      
      const res = await agent
        .put('/tasks/update')
        .send({
          id: task.dataValues.id,
          value: 200,
          Members: [{ userId: userId, roleId: role.dataValues.id }]
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
    })

    xit('should update task with an existent user assigned', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      
      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const assign = await task.createAssign({ userId: userId })
      
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
      expect(res.body.assigned).to.exist
    })

    xit('should update status to in_progress when an user is assigned', async () => {
      const registerRes = await agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = registerRes.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      
      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const assign = await task.createAssign({ userId: userId })
      
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
      expect(res.body.assigned).to.exist
      expect(res.body.status).to.equal('in_progress')
    })

    it('should update status to closed when is paid', async () => {
      const task = await models.Task.build({ url: 'http://github.com/check/issue/1', transfer_id: 'foo' }).save()
      const order = await task.createOrder({
        source_id: '12345',
        currency: 'BRL',
        amount: 256.56,
        status: 'succeeded',
        paid: true
      })
      
      await agent
        .get(`/tasks/${task.dataValues.id}/sync/value`)
        .expect('Content-Type', /json/)
        .expect(200)
      
      const t = await models.Task.findOne({ where: { id: task.dataValues.id } })
      expect(t.dataValues.status).to.equal('closed')
      expect(t.dataValues.value).to.equal('256.56')
    })

    xit('should update status to open when an user is unassigned', async () => {
      const user = await agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const userId = user.body.id
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
      
      const task = await models.Task.build({ url: github_url, provider: 'github', userId: userId }).save()
      const assign = await task.createAssign({ userId: userId })
      
      const res = await agent
        .put('/tasks/update')
        .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.value).to.equal('200')
      expect(res.body.assigned).to.exist
      expect(res.body.status).to.equal('in_progress')
      
      const logged = await login(agent, { email: 'testetaskuserassigned@gmail.com', password: 'teste' })
      const unassign = await agent
        .put(`/tasks/${task.dataValues.id}/assignment/remove`)
        .set('Authorization', logged.headers.authorization)
        .send({ id: task.dataValues.id, userId })
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(unassign.body.value).to.equal('200')
      expect(unassign.body.assigned).to.not.exist
      expect(unassign.body.status).to.equal('open')
    })

    xit('should send message to the author', async () => {
      chai.use(spies)
      const mailSpySuccess = chai.spy.on(TaskMail, 'messageAuthor')
      const firstUser = await register(agent, { email: 'owntask@gitpay.me', password: '1234' })
      const task = await buildTask({ userId: firstUser.body.id })
      const res = await registerAndLogin(agent)
      await agent
        .post(`/tasks/${task.id}/message/author`)
        .send({
          message: 'foo message'
        })
        .set('Authorization', res.headers.authorization)
        .expect(200)
      expect(mailSpySuccess).to.have.been.called()
    })
  })

  xdescribe('sync task', () => {
    xit('should sync with an open order', async () => {
      const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
      const order = await task.createOrder({
        source_id: '12345',
        currency: 'BRL',
        amount: 200
      })
      
      const res = await agent
        .get(`/tasks/${task.dataValues.id}/sync/value`)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.value.available).to.equal(0)
      expect(res.body.value.pending).to.equal(200)
    })

    it('should sync with a succeeded order', async () => {
      const task = await models.Task.build({ url: 'http://github.com/check/issue/1' }).save()
      const order = await task.createOrder({
        source_id: '12345',
        currency: 'BRL',
        amount: 200,
        status: 'succeeded'
      })
      
      const res = await agent
        .get(`/tasks/${task.dataValues.id}/sync/value`)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.value.available).to.equal(200)
      expect(res.body.value.pending).to.equal(0)
    })
  })

  xdescribe('assigned user to a task', () => {
    xit('should send email for a user interested to and user accept', async () => {
      const firstUser = await register(agent, { name: 'Task Owner', email: 'owner@example.com', password: '1234' })
      const ownerId = firstUser.body.id
      const task = await buildTask({ userId: ownerId, title: 'Test Title!' })
      const taskId = task.id

      const userToBeAssigned = await register(agent, {
        name: 'Assigned User',
        email: 'assigned@example.com',
        password: '1234'
      })
      const userToBeAssignedId = userToBeAssigned.body.id

      const logged = await login(agent, { email: 'owner@example.com', password: '1234' })
      
      const updateRes = await taskUpdate({
        id: taskId,
        Offer: { userId: userToBeAssignedId, taskId, value: 101 }
      })
      
      const assigns = await models.Assign.findAll({ where: { TaskId: updateRes.id } })
      const assignId = assigns[0].dataValues.id

      await agent
        .post('/tasks/assignment/request/')
        .set('Authorization', logged.headers.authorization)
        .send({
          assignId,
          taskId
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const confirmRes = await agent
        .put(`/tasks/assignment/request/`)
        .set('Authorization', logged.headers.authorization)
        .send({
          assignId,
          taskId,
          confirm: true
        })
        .expect(200)
      
      expect(confirmRes.statusCode).to.equal(200)

      const tasks = await models.Task.findAll({
        include: { all: true }
      })
      
      const assign = tasks[0].Assigns[0]
      const offer = tasks[0].Offers[0]
      const taskResult = tasks[0]
      expect(assign.status).to.equal('accepted')
      expect(taskResult.status).to.equal('in_progress')
      expect(offer.userId).to.equal(userToBeAssignedId)
      expect(offer.taskId).to.equal(taskId)
      expect(assign.userId).to.equal(userToBeAssignedId)
      expect(assign.TaskId).to.equal(taskId)
    })

    xit('should send email for a user interested to and user rejected ', async () => {
      const firstUser = await register(agent, { name: 'Task Owner', email: 'owner@example.com', password: '1234' })
      const ownerId = firstUser.body.id
      const task = await buildTask({ userId: ownerId, title: 'Test Title!' })
      const taskId = task.id

      const userToBeAssigned = await register(agent, {
        name: 'Assigned User',
        email: 'assigned@example.com',
        password: '1234'
      })
      const userToBeAssignedId = userToBeAssigned.body.id

      const logged = await login(agent, { email: 'owner@example.com', password: '1234' })
      
      const updateRes = await taskUpdate({
        id: taskId,
        Offer: { userId: userToBeAssignedId, taskId, value: 101 }
      })
      
      const assigns = await models.Assign.findAll({ where: { TaskId: updateRes.id } })
      const assignId = assigns[0].dataValues.id

      await agent
        .post('/tasks/assignment/request/')
        .set('Authorization', logged.headers.authorization)
        .send({
          assignId,
          taskId
        })
        .expect('Content-Type', /json/)
        .expect(200)
      
      const confirmRes = await agent
        .put(`/tasks/assignment/request/`)
        .set('Authorization', logged.headers.authorization)
        .send({
          assignId,
          taskId,
          confirm: false,
          message: 'reject message'
        })
        .expect(200)
      
      expect(confirmRes.statusCode).to.equal(200)

      const tasks = await models.Task.findAll({
        include: { all: true }
      })
      
      const assign = tasks[0].Assigns[0]
      const taskResult = tasks[0]
      expect(assign.status).to.be.equal('rejected')
      expect(assign.message).to.equal('reject message')
      expect(taskResult.status).to.be.equal('open')
    })
  })
})
