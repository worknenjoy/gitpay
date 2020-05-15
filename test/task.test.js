'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { registerAndLogin, register, login } = require('./helpers')
const nock = require('nock')
const secrets = require('../config/secrets')
const sampleIssue = require('./data/github.issue.create')
const spies = require('chai-spies')
const AssignMail = require('../modules/mail/assign')
const taskUpdate = require('../modules/tasks/taskUpdate')

describe("tasks", () => {
  // API rate limit exceeded
  const createTask = (authorizationHeader, params) => {
    return agent
      .post('/tasks/create/')
      .send(params ? params : {url: 'https://github.com/worknenjoy/truppie/issues/99'})
      .set('Authorization', authorizationHeader)
      .then(res => res.body)
  }

  const buildTask = (params) => {
    const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
    return models.Task.create({ userId: params.userId, url: github_url, provider: 'github', title: params.title || "Issue 76!" })
  }

  beforeEach(() => {
    models.Task.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    nock.cleanAll() 
  })

  describe('list tasks', () => {
    it('should list tasks', (done) => {
      agent
        .get('/tasks/list')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe('task history', () => {
    it('should create a new task and register on task history', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .post('/tasks/create/')
          .send({url: 'https://github.com/worknenjoy/truppie/issues/99'})
          .set('Authorization', res.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            models.History.findOne({where: {TaskId: res.body.id}}).then(history => {
              expect(history).to.exist;
              expect(history.TaskId).to.equal(res.body.id);
              expect(history.type).to.equal('create');
              expect(history.fields).to.have.all.members(['url', 'userId'])
              expect(history.oldValues).to.have.all.members([null, null])
              expect(history.newValues).to.have.all.members([ 'https://github.com/worknenjoy/truppie/issues/99', `${res.body.userId}` ])
              done()
            }).catch(e => {
              done(e)
            })
          })
      })
    })
    it('should sync with a succeeded order and track history', (done) => {
      models.Task.build({url: 'http://github.com/check/issue/1'}).save().then((task) => {
        task.createOrder({
          source_id: '12345',
          currency: 'BRL',
          amount: 256,
          status: 'succeeded'
        }).then((order) => {
          agent
            .get(`/tasks/${task.dataValues.id}/sync/value`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              models.History.findAll({where: {TaskId: task.dataValues.id}, order: [['id', 'DESC']]}).then(histories => {
                expect(histories.length).to.equal(2)
                const history = histories[0]
                expect(history).to.exist;
                expect(history.TaskId).to.equal(task.dataValues.id);
                expect(history.type).to.equal('update');
                expect(history.fields).to.have.all.members(['value'])
                expect(history.oldValues).to.have.all.members([null])
                expect(history.newValues).to.have.all.members(['256'])
                done()
              })
            })
            })
        });
      })
  })

  describe('Task crud', () => {
    it('should create a new task', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .post('/tasks/create/')
          .send({url: 'https://github.com/worknenjoy/truppie/issues/99'})
          .set('Authorization', res.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99');
            done();
          })
      })
    })

    it('should try to create an invalid task', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .post('/tasks/create/')
          .send({url: 'https://github.com/worknenjoy/truppie/issues/test', provider: 'github'})
          .set('Authorization', res.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            done();
          })
      })
    })

    it('should create a new task with one member', (done) => {
      registerAndLogin(agent).then(res => {
        agent
          .post('/tasks/create/')
          .send({url: 'https://github.com/worknenjoy/truppie/issues/99', provider: 'github', userId: res.body.id})
          .set('Authorization', res.headers.authorization)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99');
            done();
          })
      })
    })

    it('should invite for a task', (done) => {
      registerAndLogin(agent).then(res => {
        createTask(res.headers.authorization).then(task => {
          agent
            .post(`/tasks/${task.id}/invite/`)
            .send({
              email: 'https://github.com/worknenjoy/truppie/issues/99',
              message: 'a test invite'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              //expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99');
              done();
            })
        })
      })
    })

    it('should message user interested to solve an issue', (done) => {
      register(agent, {email: 'firstUser email', password: 'teste'}).then(firstUser => {
        register(agent, {email: 'teste_order_declined@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, user) => {
          login(agent, {email: 'firstUser email', password: 'teste'}).then(res => {
            const userId = user.body.id
            buildTask({
              userId: firstUser.body.id,
              Assigns: [{userId}]
            }).then(task => {
              task.createAssign({userId: userId}).then(assign => {
                chai.use(spies);
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
                  expect(res.statusCode).to.equal(200);
                  expect(res.body).to.exist;
                  expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/76');
                  expect(mailSpySuccess).to.have.been.called()
                  done(err);
                })
              })
            })
          })
        })
      })
    })

    it('should receive code on the platform from github auth to the redirected url for private tasks but invalid code', (done) => {
      agent
        .get('/callback/github/private/?userId=1&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7')
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.error).to.equal('bad_verification_code');
          expect(res.body).to.exist
          done();
        })
    })

    it('should receive code on the platform from github auth to the redirected url for private tasks with a valid code', (done) => {

      https://api.github.com/repos/alexanmtz/festifica/issues/1                                     │

      nock('https://github.com')
        .post('/login/oauth/access_token/', {code: 'eb518274e906c68580f7'})
        .basicAuth({user: secrets.github.id, pass: secrets.github.secret})
        .reply(200, {access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a'})
      nock('https://api.github.com')
        .get('/repos/alexanmtz/festifica/issues/1')
        .reply(200, sampleIssue.issue)
        .get('/users/alexanmtz')
        .query({client_id: secrets.github.id, client_secret: secrets.github.secret})
        .reply(200, {email: 'test@gmail.com'})
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          const userId = res.body.id
        agent
          .get(`/callback/github/private/?userId=${userId}&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7`)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(302);
            done();
          })
        })
    })

    // API rate limit exceed sometimes and this test fails (mock github call)
    xit('should fetch task', (done) => {

      const github_url = 'https://github.com/worknenjoy/truppie/issues/99';

      models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
        agent
          .get(`/tasks/fetch/${task.dataValues.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.url).to.equal(github_url);
            expect(res.body.title).to.equal('Mailchimp integration');
            expect(res.body.metadata).to.exist;
            expect(res.body.metadata.id).to.equal('99');
            expect(res.body.metadata.user).to.equal('worknenjoy');
            expect(res.body.metadata.company).to.equal('worknenjoy');
            expect(res.body.metadata.projectName).to.equal('truppie');
            expect(res.body.metadata.issue.url).to.equal('https://api.github.com/repos/worknenjoy/truppie/issues/99');
            done();
          })
        })
    });

    it('should update task', (done) => {

      const github_url = 'https://github.com/worknenjoy/truppie/issues/98';

      models.Task.build({url: github_url, value: 0}).save().then((task) => {
        agent
          .put("/tasks/update")
          .send({id: task.dataValues.id, value: 200})
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.exist;
            expect(res.body.value).to.equal('200');
            done();
          })
      })
    });

    xit('should update task with associated order no logged users', (done) => {

      const github_url = 'https://github.com/worknenjoy/truppie/issues/98';
      const order = {
        source_id: 'tok_visa',
        currency: 'BRL',
        amount: 200,
        email: 'foo@mail.com'
      }

      models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
        agent
          .put("/tasks/update")
          .send({id: task.dataValues.id, value: 200, Orders: [order]})
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.exist;
            expect(res.body.value).to.equal('200');
            //expect(res.body.Orders).to.equal({});
            done();
          })
      })
    });

    xit('should update task with associated order declined', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste_order_declined@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          const order = {
            source_id: 'tok_chargeDeclined',
            currency: 'BRL',
            amount: 200,
            email: 'foo@mail.com',
            userId: userId
          };

          models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
            agent
              .put("/tasks/update")
              .send({id: task.dataValues.id, value: 200, Orders: [order]})
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.code).to.equal('card_declined');
                done();
              })
          })
        })
    });

    it('should update task with associated user assigned', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste_task_user_assigned@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';

          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            agent
              .put("/tasks/update")
              .send({id: task.dataValues.id, value: 200, Offers: [{userId: userId, value: 100}], Assigns: [{userId: userId}]})
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.value).to.equal('200');
                done();
              })
          })
        })
    });

    it('should update task with associated user offer', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste_user_assigned_and_offer@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';

          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            agent
              .put("/tasks/update")
              .send({id: task.dataValues.id, value: 200, Assigns: [{userId: userId}], Offers: [{userId: userId, value: 100}]})
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.value).to.equal('200');
                done();
              })
          })
        })
    });

    xit('should accept offer', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste_user_accept_work@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/77777';

          models.Task.build({url: github_url, userId: userId}).save().then((task) => {
            agent
              .put("/tasks/update")
              .send({id: task.dataValues.id, value: 200, Assigns: [{userId: userId}], Offers: [{userId: userId, value: 100}]})
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.value).to.equal('200');
                agent
                  .get(`/tasks/${task.dataValues.id}/accept/${1}`)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    expect(res.body.value).to.equal('200');
                    done();
                  })
              })
          })
        })
    });

    it('should update task with members and roles', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'test23232fafa32@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';

          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            models.Role.build({name: 'admin', label: 'admin'}).save().then((role) => {
              agent
                .put("/tasks/update")
                .send({id: task.dataValues.id, value: 200, Members: [{userId: userId, roleId: role.dataValues.id}]})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200');
                  done();
                })
              })
          })
        })
    });

    it('should update task with an existent user assigned', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testetaskuserassigned@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            task.createAssign({userId: userId}).then((assign) => {
              agent
                .put("/tasks/update")
                .send({id: task.dataValues.id, value: 200, assigned: assign.dataValues.id})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200');
                  expect(res.body.assigned).to.exist;
                  done();
                })
            })
          })
        })
    });

    it('should update status to in_progress when an user is assigned', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testetaskuserassigned@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            task.createAssign({userId: userId}).then((assign) => {
              agent
                .put("/tasks/update")
                .send({id: task.dataValues.id, value: 200, assigned: assign.dataValues.id})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200');
                  expect(res.body.assigned).to.exist;
                  expect(res.body.status).to.equal('in_progress')
                  done();
                })
            })
          })
        })
    });

    it('should update status to closed when is paid', (done) => {
      models.Task.build({url: 'http://github.com/check/issue/1', transfer_id: 'foo'}).save().then((task) => {
        task.createOrder({
          source_id: '12345',
          currency: 'BRL',
          amount: 256,
          status: 'succeeded'
        }).then((order) => {
          agent
            .get(`/tasks/${task.dataValues.id}/sync/value`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              models.Task.findOne({where: {id: task.dataValues.id}}).then(t => {
                expect(t.dataValues.status).to.equal('closed')
                done()
              }).catch(done)
            })
        });
      })
    });

    it('should update status to open when an user is unassigned', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testetaskuserassigned@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, user) => {
          const userId = user.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({url: github_url, provider: 'github', userId: userId}).save().then((task) => {
            task.createAssign({userId: userId}).then((assign) => {
              agent
                .put("/tasks/update")
                .send({id: task.dataValues.id, value: 200, assigned: assign.dataValues.id})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  expect(res.body.value).to.equal('200');
                  expect(res.body.assigned).to.exist;
                  expect(res.body.status).to.equal('in_progress')
                  login(agent, {email: 'testetaskuserassigned@gmail.com', password: 'teste'}).then(logged => {
                    agent
                      .put(`/tasks/${task.dataValues.id}/assignment/remove`)
                      .set('Authorization', logged.headers.authorization)
                      .send({id: task.dataValues.id, userId})
                      .expect('Content-Type', /json/)
                      .expect(200)
                      .end((err, unassign) => {
                        expect(unassign.body.value).to.equal('200');
                        expect(unassign.body.assigned).to.not.exist;
                        expect(unassign.body.status).to.equal('open')
                        done();
                      })
                  })
                })
            })
          })
        })
    });

    it('should delete a task by id', (done) => {
      registerAndLogin(agent).then(res => {
        createTask(res.headers.authorization).then(task => {
          agent
            .delete(`/tasks/delete/${task.id}`)
            .set('Authorization', res.headers.authorization)
            .expect(200)
            .then(async () => {
              expect(
                await models.Task.findById(task.id).catch(done)
              ).to.be.null
              done()
            })
        })
      })
    })

    it('should only delete own task', async () => {
      const firstUser = await register(agent, {email: 'owntask@example.com', password: '1234'}) 
      const task = await buildTask({ userId: firstUser.id })
      const res = await registerAndLogin(agent)
      await agent
        .delete(`/tasks/delete/${task.id}`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      expect(
        await models.Task.findById(task.id)
      ).to.be.ok
    })

    it('should delete task', (done) => {
      registerAndLogin(agent).then(res => {
        createTask(res.headers.authorization).then(task => {
          agent
          .delete(`/tasks/delete/${task.id}`)
          .set('Authorization', res.headers.authorization)
          .expect(200)
          .end((err, deleted) => {
            console.log('result from should deletet ask', deleted)
            expect(deleted.text).to.equal('1')
            done()
          }) 
        })
      })
    })
});

  describe('sync task', () => {
    it('should sync with an open order', (done) => {
      models.Task.build({url: 'http://github.com/check/issue/1'}).save().then((task) => {
        task.createOrder({
          source_id: '12345',
          currency: 'BRL',
          amount: 200
        }).then((order) => {
          agent
            .get(`/tasks/${task.dataValues.id}/sync/value`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              expect(res.body.value.available).to.equal(0);
              expect(res.body.value.pending).to.equal(200);
              done();
            })
        });
      })
    });
    it('should sync with a succeeded order', (done) => {
      models.Task.build({url: 'http://github.com/check/issue/1'}).save().then((task) => {
        task.createOrder({
          source_id: '12345',
          currency: 'BRL',
          amount: 200,
          status: 'succeeded'
        }).then((order) => {
          agent
            .get(`/tasks/${task.dataValues.id}/sync/value`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              expect(res.body.value.available).to.equal(200);
              expect(res.body.value.pending).to.equal(0);
              done();
            })
        });
      })
    });
  })

  describe('assigned user to a task', () => {

    it('should send email for a user interested to and user accept',(done) => {
      // create user, login and task
      register(agent, {name: "Task Owner", email: 'owner@example.com', password: '1234'}).then(({body: {id}}) => {
        const ownerId = id
        buildTask({ userId: ownerId, title: 'Test Title!' }).then( (task) => {
        const taskId = task.id

        register(agent, {name: "Assigned User", email: 'assigned@example.com', password: '1234'}).then( ({body: {id}}) => {
          const userToBeAssignedId = id

          login(agent, {email: 'owner@example.com', password: '1234'}).then(logged => {

            // create Offer and Assign for task
            taskUpdate({id: taskId, Offer: {userId: userToBeAssignedId, taskId, value: 101}}).then(res => {

              // get Assign ID
              models.Assign.findAll({where: {TaskId: res.id}}).then(res => {
              const assignId  = res[0].dataValues.id

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
                      include: { all: true}
                      }
                      ).then( res => {
                        const assign = res[0].Assigns[0]
                        const offer = res[0].Offers[0]
                        const task = res[0]
                        expect(assign.status).to.equal('accepted')
                        expect(task.status).to.equal('in_progress')
                        expect(offer.userId).to.equal(userToBeAssignedId)
                        expect(offer.taskId).to.equal(taskId)
                        expect(assign.userId).to.equal(userToBeAssignedId)
                        expect(assign.TaskId).to.equal(taskId)
                        done()
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

    it('should send email for a user interested to and user rejected ',(done) => {
      // create user, login and task
      register(agent, {name: "Task Owner", email: 'owner@example.com', password: '1234'}).then(({body: {id}}) => {
        const ownerId = id
        buildTask({ userId: ownerId, title: 'Test Title!' }).then( (task) => {
        const taskId = task.id

        register(agent, {name: "Assigned User", email: 'assigned@example.com', password: '1234'}).then( ({body: {id}}) => {
          const userToBeAssignedId = id

          login(agent, {email: 'owner@example.com', password: '1234'}).then(logged => {

            // create Offer and Assign for task
            taskUpdate({id: taskId, Offer: {userId: userToBeAssignedId, taskId, value: 101}}).then(res => {

              // get Assign ID
              models.Assign.findAll({where: {TaskId: res.id}}).then(res => {
              const assignId  = res[0].dataValues.id

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
                      include: { all: true}
                      }
                      ).then( res => {
                        const assign = res[0].Assigns[0]
                        const task = res[0]
                        expect(assign.status).to.be.equal('rejected')
                        expect(assign.message).to.equal('reject message')
                        expect(task.status).to.be.equal('open')
                        done()
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

  })
});
