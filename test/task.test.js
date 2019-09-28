'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { registerAndLogin, register } = require('./helpers')
const nock = require('nock')
const secrets = require('../config/secrets')
const sampleIssue = require('./data/github.issue.create')

describe("tasks", () => {
  // API rate limit exceeded
  const createTask = (authorizationHeader) => {
    return agent
      .post('/tasks/create/')
      .send({url: 'https://github.com/worknenjoy/truppie/issues/99'})
      .set('Authorization', authorizationHeader)
      .then(res => res.body)
  }

  const buildTask = (params) => {
    const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
    return models.Task.create({ userId: params.userId, url: github_url, provider: 'github' })
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

    it('should receive code on the platform from github auth to the redirected url for private tasks but invalid code', (done) => {
      agent
        .get('/callback/github/private/?userId=1&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7')
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.exist
          done();
        })
    })

    it('should receive code on the platform from github auth to the redirected url for private tasks with a valid code', (done) => {
      nock('https://github.com')
        .get(`/login/oauth/access_token/?client_id=${secrets.github.id}&client_secret=${secrets.github.secret}&code=eb518274e906c68580f7`)
        .reply(200, {url: 'foo'})
      nock('https://api.github.com')
        .get(`/repos/alexanmtz/festifica/issues/1`)
        .reply(200, sampleIssue.issue)
      agent
        .get('/callback/github/private/?userId=1&url=https%3A%2F%2Fgithub.com%2Falexanmtz%2Ffestifica%2Fissues%2F1&code=eb518274e906c68580f7')
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          //expect(res.body.access_token).to.equal("e72e16c7e42f292c6912e7710c838347ae178b4a")
          expect(res.body.url).to.equal('foo')
          done();
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
            .catch(done)
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
});
