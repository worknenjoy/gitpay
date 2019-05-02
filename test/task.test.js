'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const { registerAndLogin } = require('./helpers')

describe("tasks", () => {

  beforeEach(() => {
    models.Task.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
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

  describe('Task crud', () => {
    // API rate limit exceeded
    const createTask = (authorizationHeader) => {
      return agent
        .post('/tasks/create/')
        .send({url: 'https://github.com/worknenjoy/truppie/issues/99'})
        .set('Authorization', authorizationHeader)
        .then(res => res.body)
    }

    const buildTask = () => {
      const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
      return models.Task.create({ url: github_url, provider: 'github' })
    }

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
      const task = await buildTask({ userId: Number.MAX_VALUE })
      const res = await registerAndLogin(agent)
      await agent
        .delete(`/tasks/delete/${task.id}`)
        .set('Authorization', res.headers.authorization)
        .expect(200)
      expect(
        await models.Task.findById(task.id)
      ).to.be.ok
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
