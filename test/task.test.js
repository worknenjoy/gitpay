'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const api = require('../src/server').default
const agent = request.agent(api)
const models = require('../src/models')
const { registerAndLogin, register, login, truncateModels } = require('./helpers')
const nock = require('nock')
const secrets = require('../src/config/secrets')
const sampleIssue = require('./data/github/github.issue.create')
const getSingleIssue = require('./data/github/github.issue.get')
const getIssueError = require('./data/github/github.issue.error')
const getSingleRepo = require('./data/github/github.repository.get')
const spies = require('chai-spies')
const AssignMail = require('../src/modules/mail/assign')
const TaskMail = require('../src/modules/mail/task')
const taskUpdate = require('../src/modules/tasks/taskUpdate')

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
  // API rate limit exceeded
  const createTask = (authorizationHeader, params) => {
    return agent
      .post('/tasks/create/')
      .send(params ? params : { url: 'https://github.com/worknenjoy/truppie/issues/99' })
      .set('Authorization', authorizationHeader)
      .then((res) => res.body)
  }

  const buildTask = (params) => {
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
    it('should list tasks', (done) => {
      agent
        .get('/tasks/list')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          done(err)
        })
    })
  })

  xdescribe('task history', () => {
    it('should create a new task and register on task history', (done) => {
      registerAndLogin(agent)
        .then((res) => {
          agent
            .post('/tasks/create/')
            .send({ url: 'https://github.com/worknenjoy/truppie/issues/99' })
            .set('Authorization', res.headers.authorization)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) done(err)
              models.History.findOne({ where: { TaskId: res.body.id } })
                .then((history) => {
                  expect(history).to.exist
                  expect(history.TaskId).to.equal(res.body.id)
                  expect(history.type).to.equal('create')
                  expect(history.fields).to.have.all.members(['url', 'userId'])
                  expect(history.oldValues).to.have.all.members([null, null])
                  expect(history.newValues).to.have.all.members([
                    'https://github.com/worknenjoy/truppie/issues/99',
                    `${res.body.userId}`
                  ])
                  done(err)
                })
                .catch(done)
            })
        })
        .catch(done)
    })
    xit('should sync with a succeeded order and track history', (done) => {
      models.Task.build({ url: 'http://github.com/check/issue/1' })
        .save()
        .then((task) => {
          task
            .createOrder({
              source_id: '12345',
              currency: 'BRL',
              amount: 256,
              status: 'succeeded'
            })
            .then((order) => {
              agent
                .get(`/tasks/${task.dataValues.id}/sync/value`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  if (err) done(err)
                  models.History.findAll({
                    where: { TaskId: task.dataValues.id },
                    order: [['id', 'DESC']]
                  }).then((histories) => {
                    expect(histories.length).to.equal(2)
                    const history = histories[0]
                    expect(history).to.exist
                    expect(history.TaskId).to.equal(task.dataValues.id)
                    expect(history.type).to.equal('update')
                    expect(history.fields).to.have.all.members(['value'])
                    expect(history.oldValues).to.have.all.members([null])
                    expect(history.newValues).to.have.all.members(['256'])
                    done(err)
                  })
                })
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('Task crud', () => {
    it('should create a new task wiht projects ands organizations', (done) => {
      nockAuth()
      registerAndLogin(agent)
        .then((res) => {
          createTask(res.headers.authorization, {
            url: 'https://github.com/worknenjoy/gitpay/issues/1080'
          })
            .then((task) => {
              expect(task.url).to.equal('https://github.com/worknenjoy/gitpay/issues/1080')
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should give error on update if the task already exists', (done) => {
      nockAuth()
      registerAndLogin(agent)
        .then((res) => {
          createTask(res.headers.authorization, {
            url: 'https://github.com/worknenjoy/gitpay/issues/1080',
            provider: 'github'
          })
            .then(() => {
              createTask(res.headers.authorization, {
                url: 'https://github.com/worknenjoy/gitpay/issues/1080',
                provider: 'github'
              })
                .then((task) => {
                  expect(task.errors).to.exist
                  expect(task.errors[0].message).to.equal('url must be unique')
                  done()
                })
                .catch(done)
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should give an error on create if the issue build responds with limit exceeded', (done) => {
      nockAuthLimitExceeded()
      registerAndLogin(agent)
        .then((res) => {
          createTask(res.headers.authorization, {
            url: 'https://github.com/worknenjoy/gitpay/issues/1080',
            provider: 'github'
          })
            .then((task) => {
              expect(task.error).exist
              expect(task.error).to.contain('API rate limit exceeded')
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should not raise an error on fetch if the issue build responds with limit exceeded', (done) => {
      registerAndLogin(agent)
        .then((res) => {
          createTask(res.headers.authorization, {
            url: 'https://github.com/worknenjoy/gitpay/issues/1080',
            provider: 'github'
          })
            .then((task) => {
              nockAuthLimitExceeded()
              agent.get(`/tasks/fetch/${task.id}`).end((err, res) => {
                expect(res.body).exist
                expect(res.body.id).to.equal(task.id)
                done()
              })
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should try to create an invalid task', (done) => {
      registerAndLogin(agent)
        .then((res) => {
          agent
            .post('/tasks/create/')
            .send({ url: 'https://github.com/worknenjoy/truppie/issues/test', provider: 'github' })
            .set('Authorization', res.headers.authorization)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(res.statusCode).to.equal(400)
              done(err)
            })
        })
        .catch(done)
    })

    xit('should create a new task with one member', (done) => {
      register(agent)
        .then((user) => {
          login(agent)
            .then((res) => {
              agent
                .post('/tasks/create/')
                .send({
                  url: 'https://github.com/worknenjoy/truppie/issues/99',
                  provider: 'github',
                  userId: user.body.id
                })
                .set('Authorization', res.headers.authorization)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99')
                  done(err)
                })
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should invite for a task', (done) => {
      registerAndLogin(agent)
        .then((res) => {
          createTask(res.headers.authorization)
            .then((task) => {
              agent
                .post(`/tasks/${task.id}/invite/`)
                .send({
                  email: 'https://github.com/worknenjoy/truppie/issues/99',
                  message: 'a test invite'
                })
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  //expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99');
                  done(err)
                })
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should message user interested to solve an issue', (done) => {
      register(agent, { email: 'firstUser email', password: 'teste' })
        .then((firstUser) => {
          register(agent, { email: 'teste_order_declined@gmail.com', password: 'teste' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, user) => {
              login(agent, { email: 'firstUser email', password: 'teste' })
                .then((res) => {
                  const userId = user.body.id
                  buildTask({
                    userId: firstUser.body.id,
                    Assigns: [{ userId }],
                    userId: userId
                  })
                    .then((task) => {
                      task
                        .createAssign({ userId: userId })
                        .then((assign) => {
                          chai.use(spies)
                          const mailSpySuccess = chai.spy.on(AssignMail, 'messageInterested')
                          agent
                            .post(`/tasks/${task.id}/message/`)
                            .send({
                              interested: assign.id,
                              message: 'Hey, are you prepared to work on this?'
                            })
                            .set('Authorization', res.headers.authorization)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                              expect(res.statusCode).to.equal(200)
                              expect(res.body).to.exist
                              expect(res.body.url).to.equal(
                                'https://github.com/worknenjoy/truppie/issues/76'
                              )
                              expect(mailSpySuccess).to.have.been.called()
                              done(err)
                            })
                        })
                        .catch(done)
                    })
                    .catch(done)
                })
                .catch(done)
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should receive code on the platform from github auth to the redirected url for private tasks but invalid code', (done) => {
      agent
        .get(
          '/callback/github/private/?userId=1&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7'
        )
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401)
          expect(res.body.error).to.equal('bad_verification_code')
          expect(res.body).to.exist
          done()
        })
    })

    it('should receive code on the platform from github auth to the redirected url for private tasks with a valid code', (done) => {
      // https://api.github.com/repos/alexanmtz/festifica/issues/1                                     │

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
      agent
        .post('/auth/register')
        .send({ email: 'teste@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          const userId = res.body.id
          agent
            .get(
              `/callback/github/private/?userId=${userId}&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7`
            )
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              done()
            })
        })
    })

    describe('task fetch', () => {
      beforeEach(async () => {
        nock('https://api.github.com')
          .persist()
          .get('/users/worknenjoy')
          .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
          .reply(200, getSingleRepo.repo)
      })

      it('should fetch task', (done) => {
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

        models.Task.build({ url: github_url, provider: 'github', title: 'foo' })
          .save()
          .then((task) => {
            agent
              .get(`/tasks/fetch/${task.dataValues.id}`)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
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
                done(err)
              })
          })
          .catch(done)
      })

      it('should fetch task and not sync status in_progress on Gitpay and open on Github', (done) => {
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

        models.Task.build({ url: github_url, provider: 'github', title: 'foo' })
          .save()
          .then((task) => {
            models.Task.update({ status: 'in_progress' }, { where: { id: task.dataValues.id } })
              .then(() => {
                agent
                  .get(`/tasks/fetch/${task.dataValues.id}`)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.exist
                    expect(res.body.metadata.id).to.equal('1080')
                    expect(res.body.status).to.equal('in_progress')
                    done(err)
                  })
              })
              .catch(done)
          })
          .catch(done)
      })

      it('should fetch task and sync status in_progress on Gitpay and closed on Github', (done) => {
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

        models.Task.build({ url: github_url, provider: 'github', title: 'foo' })
          .save()
          .then((task) => {
            models.Task.update({ status: 'in_progress' }, { where: { id: task.dataValues.id } })
              .then(() => {
                agent
                  .get(`/tasks/fetch/${task.dataValues.id}`)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.exist
                    expect(res.body.metadata.id).to.equal('1080')
                    expect(res.body.status).to.equal('closed')
                    done(err)
                  })
              })
              .catch(done)
          })
          .catch(done)
      })
    })

    xit('should update task value', (done) => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'

      nock('https://github.com')
        .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
        .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
        .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
      nock('https://api.github.com')
        .get('/repos/worknenjoy/truppie/issues/98')
        .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
        .reply(200, sampleIssue.issue)

      models.Task.build({ url: github_url, value: 0 })
        .save()
        .then((task) => {
          agent
            .put('/tasks/update')
            .send({ id: task.dataValues.id, value: 200 })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.exist
              expect(res.body.value).to.equal('200')
              done(err)
            })
        })
        .catch(done)
    })

    xit('should update task status', (done) => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'

      nock('https://github.com')
        .post('/login/oauth/access_token/', { code: 'eb518274e906c68580f7' })
        .basicAuth({ user: secrets.github.id, pass: secrets.github.secret })
        .reply(200, { access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a' })
      nock('https://api.github.com')
        .get('/repos/worknenjoy/truppie/issues/98')
        .query({ client_id: secrets.github.id, client_secret: secrets.github.secret })
        .reply(200, sampleIssue.issue)

      models.Task.build({ url: github_url })
        .save()
        .then((task) => {
          agent
            .put('/tasks/update')
            .send({ id: task.dataValues.id, status: 'in_progress' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.exist
              expect(res.body.status).to.equal('in_progress')
              done(err)
            })
        })
        .catch(done)
    })

    xit('should update task with associated order no logged users', (done) => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/98'
      const order = {
        source_id: 'tok_visa',
        currency: 'BRL',
        amount: 200,
        email: 'foo@mail.com'
      }

      models.Task.build({ url: github_url, provider: 'github' })
        .save()
        .then((task) => {
          agent
            .put('/tasks/update')
            .send({ id: task.dataValues.id, value: 200, Orders: [order] })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.exist
              expect(res.body.value).to.equal('200')
              //expect(res.body.Orders).to.equal({});
              done()
            })
        })
    })

    xit('should update task with associated order declined', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'teste_order_declined@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
          const order = {
            source_id: 'tok_chargeDeclined',
            currency: 'BRL',
            amount: 200,
            email: 'foo@mail.com',
            userId: userId
          }

          models.Task.build({ url: github_url, provider: 'github' })
            .save()
            .then((task) => {
              agent
                .put('/tasks/update')
                .send({ id: task.dataValues.id, value: 200, Orders: [order] })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.code).to.equal('card_declined')
                  done()
                })
            })
        })
    })

    xit('should update task with associated user assigned', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'teste_task_user_assigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              agent
                .put('/tasks/update')
                .send({
                  id: task.dataValues.id,
                  value: 200,
                  Offers: [{ userId: userId, value: 100 }],
                  Assigns: [{ userId: userId }]
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200')
                  done()
                })
            })
            .catch(done)
        })
    })

    xit('should update task with associated user offer', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'teste_user_assigned_and_offer@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              agent
                .put('/tasks/update')
                .send({
                  id: task.dataValues.id,
                  value: 200,
                  Assigns: [{ userId: userId }],
                  Offers: [{ userId: userId, value: 100 }]
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200')
                  done()
                })
            })
        })
    })

    xit('should accept offer', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'teste_user_accept_work@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/77777'

          models.Task.build({ url: github_url, userId: userId })
            .save()
            .then((task) => {
              agent
                .put('/tasks/update')
                .send({
                  id: task.dataValues.id,
                  value: 200,
                  Assigns: [{ userId: userId }],
                  Offers: [{ userId: userId, value: 100 }]
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200')
                  agent
                    .get(`/tasks/${task.dataValues.id}/accept/${1}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.body.value).to.equal('200')
                      done()
                    })
                })
            })
        })
    })

    xit('should update task with members and roles', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'test23232fafa32@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'

          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              models.Role.build({ name: 'admin', label: 'admin' })
                .save()
                .then((role) => {
                  agent
                    .put('/tasks/update')
                    .send({
                      id: task.dataValues.id,
                      value: 200,
                      Members: [{ userId: userId, roleId: role.dataValues.id }]
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.body.value).to.equal('200')
                      done(err)
                    })
                })
                .catch(done)
            })
            .catch(done)
        })
    })

    xit('should update task with an existent user assigned', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              task
                .createAssign({ userId: userId })
                .then((assign) => {
                  agent
                    .put('/tasks/update')
                    .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.body.value).to.equal('200')
                      expect(res.body.assigned).to.exist
                      done(err)
                    })
                })
                .catch(done)
            })
            .catch(done)
        })
    })

    xit('should update status to in_progress when an user is assigned', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              task
                .createAssign({ userId: userId })
                .then((assign) => {
                  agent
                    .put('/tasks/update')
                    .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.body.value).to.equal('200')
                      expect(res.body.assigned).to.exist
                      expect(res.body.status).to.equal('in_progress')
                      done()
                    })
                })
                .catch(done)
            })
            .catch(done)
        })
    })

    it('should update status to closed when is paid', (done) => {
      models.Task.build({ url: 'http://github.com/check/issue/1', transfer_id: 'foo' })
        .save()
        .then((task) => {
          task
            .createOrder({
              source_id: '12345',
              currency: 'BRL',
              amount: 256.56,
              status: 'succeeded'
            })
            .then((order) => {
              agent
                .get(`/tasks/${task.dataValues.id}/sync/value`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  models.Task.findOne({ where: { id: task.dataValues.id } })
                    .then((t) => {
                      expect(t.dataValues.status).to.equal('closed')
                      expect(t.dataValues.value).to.equal('256.56')
                      done(err)
                    })
                    .catch(done)
                })
            })
            .catch(done)
        })
    })

    xit('should update status to open when an user is unassigned', (done) => {
      agent
        .post('/auth/register')
        .send({ email: 'testetaskuserassigned@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, user) => {
          const userId = user.body.id
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76'
          models.Task.build({ url: github_url, provider: 'github', userId: userId })
            .save()
            .then((task) => {
              task
                .createAssign({ userId: userId })
                .then((assign) => {
                  agent
                    .put('/tasks/update')
                    .send({ id: task.dataValues.id, value: 200, assigned: assign.dataValues.id })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                      expect(res.body.value).to.equal('200')
                      expect(res.body.assigned).to.exist
                      expect(res.body.status).to.equal('in_progress')
                      login(agent, { email: 'testetaskuserassigned@gmail.com', password: 'teste' })
                        .then((logged) => {
                          agent
                            .put(`/tasks/${task.dataValues.id}/assignment/remove`)
                            .set('Authorization', logged.headers.authorization)
                            .send({ id: task.dataValues.id, userId })
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, unassign) => {
                              expect(unassign.body.value).to.equal('200')
                              expect(unassign.body.assigned).to.not.exist
                              expect(unassign.body.status).to.equal('open')
                              done(err)
                            })
                        })
                        .catch(done)
                    })
                    .catch(done)
                })
                .catch(done)
            })
            .catch(done)
        })
    })

    xit('should send message to the author', async (done) => {
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
    xit('should sync with an open order', (done) => {
      models.Task.build({ url: 'http://github.com/check/issue/1' })
        .save()
        .then((task) => {
          task
            .createOrder({
              source_id: '12345',
              currency: 'BRL',
              amount: 200
            })
            .then((order) => {
              agent
                .get(`/tasks/${task.dataValues.id}/sync/value`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.value.available).to.equal(0)
                  expect(res.body.value.pending).to.equal(200)
                  done(err)
                })
            })
            .catch(done)
        })
    })
    it('should sync with a succeeded order', (done) => {
      models.Task.build({ url: 'http://github.com/check/issue/1' })
        .save()
        .then((task) => {
          task
            .createOrder({
              source_id: '12345',
              currency: 'BRL',
              amount: 200,
              status: 'succeeded'
            })
            .then((order) => {
              agent
                .get(`/tasks/${task.dataValues.id}/sync/value`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.statusCode).to.equal(200)
                  expect(res.body).to.exist
                  expect(res.body.value.available).to.equal(200)
                  expect(res.body.value.pending).to.equal(0)
                  done()
                })
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  xdescribe('assigned user to a task', () => {
    xit('should send email for a user interested to and user accept', (done) => {
      // create user, login and task
      register(agent, { name: 'Task Owner', email: 'owner@example.com', password: '1234' })
        .then(({ body: { id } }) => {
          const ownerId = id
          buildTask({ userId: ownerId, title: 'Test Title!' })
            .then((task) => {
              const taskId = task.id

              register(agent, {
                name: 'Assigned User',
                email: 'assigned@example.com',
                password: '1234'
              })
                .then(({ body: { id } }) => {
                  const userToBeAssignedId = id

                  login(agent, { email: 'owner@example.com', password: '1234' })
                    .then((logged) => {
                      // create Offer and Assign for task
                      taskUpdate({
                        id: taskId,
                        Offer: { userId: userToBeAssignedId, taskId, value: 101 }
                      }).then((res) => {
                        // get Assign ID
                        models.Assign.findAll({ where: { TaskId: res.id } }).then((res) => {
                          const assignId = res[0].dataValues.id

                          // assign user to a task
                          agent
                            .post('/tasks/assignment/request/')
                            .set('Authorization', logged.headers.authorization)
                            .send({
                              assignId,
                              taskId
                            })
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                              // send token rejecting task as send by web
                              agent
                                .put(`/tasks/assignment/request/`)
                                .set('Authorization', logged.headers.authorization)
                                .send({
                                  assignId,
                                  taskId,
                                  confirm: true
                                })
                                .expect(200)
                                .end((err, res) => {
                                  expect(res.statusCode).to.equal(200)

                                  // check if Task updated correctly
                                  models.Task.findAll({
                                    include: { all: true }
                                  })
                                    .then((res) => {
                                      const assign = res[0].Assigns[0]
                                      const offer = res[0].Offers[0]
                                      const task = res[0]
                                      expect(assign.status).to.equal('accepted')
                                      expect(task.status).to.equal('in_progress')
                                      expect(offer.userId).to.equal(userToBeAssignedId)
                                      expect(offer.taskId).to.equal(taskId)
                                      expect(assign.userId).to.equal(userToBeAssignedId)
                                      expect(assign.TaskId).to.equal(taskId)
                                      done(err)
                                    })
                                    .catch(done)
                                })
                                .catch(done)
                            })
                        })
                      })
                    })
                    .catch(done)
                })
                .catch(done)
            })
            .catch(done)
        })
        .catch(done)
    })

    xit('should send email for a user interested to and user rejected ', (done) => {
      // create user, login and task
      register(agent, { name: 'Task Owner', email: 'owner@example.com', password: '1234' })
        .then(({ body: { id } }) => {
          const ownerId = id
          buildTask({ userId: ownerId, title: 'Test Title!' })
            .then((task) => {
              const taskId = task.id

              register(agent, {
                name: 'Assigned User',
                email: 'assigned@example.com',
                password: '1234'
              })
                .then(({ body: { id } }) => {
                  const userToBeAssignedId = id

                  login(agent, { email: 'owner@example.com', password: '1234' })
                    .then((logged) => {
                      // create Offer and Assign for task
                      taskUpdate({
                        id: taskId,
                        Offer: { userId: userToBeAssignedId, taskId, value: 101 }
                      }).then((res) => {
                        // get Assign ID
                        models.Assign.findAll({ where: { TaskId: res.id } }).then((res) => {
                          const assignId = res[0].dataValues.id

                          // assign user to a task
                          agent
                            .post('/tasks/assignment/request/')
                            .set('Authorization', logged.headers.authorization)
                            .send({
                              assignId,
                              taskId
                            })
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                              // send token rejecting task as send by web
                              agent
                                .put(`/tasks/assignment/request/`)
                                .set('Authorization', logged.headers.authorization)
                                .send({
                                  assignId,
                                  taskId,
                                  confirm: false,
                                  message: 'reject message'
                                })
                                .expect(200)
                                .end((err, res) => {
                                  expect(res.statusCode).to.equal(200)

                                  // check if Task updated correctly
                                  models.Task.findAll({
                                    include: { all: true }
                                  })
                                    .then((res) => {
                                      const assign = res[0].Assigns[0]
                                      const task = res[0]
                                      expect(assign.status).to.be.equal('rejected')
                                      expect(assign.message).to.equal('reject message')
                                      expect(task.status).to.be.equal('open')
                                      done(err)
                                    })
                                    .catch(done)
                                })
                                .catch(done)
                            })
                        })
                      })
                    })
                    .catch(done)
                })
                .catch(done)
            })
            .catch(done)
        })
        .catch(done)
    })
  })
})
