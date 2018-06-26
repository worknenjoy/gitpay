'use strict';

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../loading/loading');

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
    it('should create a new task', (done) => {
      agent
        .post('/tasks/create/')
        .send({url: 'https://github.com/worknenjoy/truppie/issues/99'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body.url).to.equal('https://github.com/worknenjoy/truppie/issues/99');
          done();
        })
    })

    // API rate limit exceeded
    it('should fetch task', (done) => {

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

    it('should update task with associated order no logged users', (done) => {

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

    it('should update task with associated order declined', (done) => {

      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
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
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';

          models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
            agent
              .put("/tasks/update")
              .send({id: task.dataValues.id, value: 200, Assigns: [{userId: userId}]})
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.value).to.equal('200');
                done();
              })
          })
        })
    });

    it('should update task with an user assinged', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
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
  });

  describe('sync task', () => {
    it('should sync with a open order', (done) => {
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
