const expect = require('chai').expect
const Promise = require('bluebird')
const api = require('../server')
const models = require('../models')
const request = require('supertest')
const agent = request.agent(api)
const { TaskCron } = require('../cron')
const MockDate = require('mockdate')

describe('Crons', () => {
  beforeEach(() => {
    models.Task.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })


  describe('Task', () => {
    it('Remember about tasks with bounty invested weekly', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          Promise.all([
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7364', userId: res.body.id, status: 'in_progress'}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7365', userId: res.body.id, status: 'closed', value: 100}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7366', userId: res.body.id}),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7367', userId: res.body.id, value: 50}).save()
          ]).then( tasks => {
            expect(tasks[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
            expect(tasks[2].dataValues.value).to.equal('100')
            TaskCron.weeklyBounties().then( r => {
              expect(r.length).to.equal(1)
              expect(r[0]).to.exist;  
              expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7367')
              MockDate.reset()
              done()
            })
          })
        })
      })
    })
    it('Send email about bounties', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save().then( task => {
            expect(task.dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
            done()
          }).catch( e => {
            // eslint-disable-next-line no-console
            console.log('error', e)
            done(e)
          })
      })
    })
    it('remember deadline 2 days left', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcrondeadline@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          models.Task.build({deadline: new Date('2000-11-24'), url: 'https://github.com/worknenjoy/truppie/issues/7336', userId: res.body.id, status: 'in_progress'}).save().then( task => {
            task.createAssign({userId: res.body.id}).then((assign) => {
                task.update({
                  assigned: assign.dataValues.id
                }).then( taskUpdated => {
                  TaskCron.rememberDeadline().then( r => {
                    expect(r[0]).to.exist;  
                    expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7336')
                    MockDate.reset()
                    done()
                })
          })
        })
      })
    })
    it('remember deadline 2 days past', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcrondeadline2@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          models.Task.build({deadline: new Date('2000-11-27'), url: 'https://github.com/worknenjoy/truppie/issues/7336', userId: res.body.id, status: 'in_progress'}).save().then( task => {
            task.createAssign({userId: res.body.id}).then((assign) => {
                task.update({
                  assigned: assign.dataValues.id
                }).then( taskUpdated => {
                  TaskCron.rememberDeadline().then( r => {
                    expect(r[0]).to.exist;  
                    expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7336')
                    MockDate.reset()
                    done()
                })
            })
          })
        })
      })
    })
  })
})
