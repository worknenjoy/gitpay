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
    it('should create a new task', (done) => {
      agent
        .post('/tasks/create/')
        .send({url: 'http://foo.com', provider: 'github'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })

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
            expect(res.body.metadata).to.exist;
            expect(res.body.metadata.id).to.equal('99');
            expect(res.body.metadata.user).to.equal('worknenjoy');
            expect(res.body.metadata.company).to.equal('worknenjoy');
            expect(res.body.metadata.projectName).to.equal('truppie');
            expect(res.body.metadata.issue.url).to.equal('https://api.github.com/repos/worknenjoy/truppie/issues/99');
            done();
          })
        }).catch(e => {
          console.log('error create task');
          console.log(e);
        })
    });

    it('should update task', (done) => {

      const github_url = 'https://github.com/worknenjoy/truppie/issues/98';

      models.Task.build({url: github_url, provider: 'github'}).save().then((task) => {
        agent
          .put("/tasks/update")
          .send({id: task.dataValues.id, value: 200})
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.exist;
            console.log('error', err);
            console.log(res.body);
            expect(res.body.value).to.equal('200');
            done();
          })
      }).catch(e => {
        console.log('error create task');
        console.log(e);
      })
    });

    it('should update task with associated order no logged users', (done) => {

      const github_url = 'https://github.com/worknenjoy/truppie/issues/98';
      const order = {
        source_id: 'tok_1CPcpBBrSjgsps2DzfcePOYA',
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
      }).catch(e => {
        console.log('error create task');
        console.log(e);
      })
    });

    it('should update task with associated order logged users', (done) => {

      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userId = res.body.id;
          const github_url = 'https://github.com/worknenjoy/truppie/issues/76';
          const order = {
            source_id: 'tok_1CPcpBBrSjgsps2DzfcePOYA',
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
                expect(res.body.value).to.equal('200');
                models.Order.findAll({where: {userId: userId }}).then((order) => {
                  expect(order[0].dataValues.userId).to.equal(userId);
                  //expect(order[0].dataValues.paid).to.equal(true);
                  //expect(order[0].dataValues.status).to.equal("succeeded");
                  models.User.findOne({where: {id: userId}}).then((user) => {
                    //expect(user.dataValues.customer_id).to.exist;
                    done();
                  });
                });
              })
          }).catch(e => {
            console.log('error create task');
            console.log(e);
          })
        })
    });

  });
});
