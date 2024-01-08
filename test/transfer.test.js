'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { registerAndLogin, createTask, createOrder, createAssign, createTransfer } = require('./helpers')
const { create } = require('core-js/core/object')
const models = require('../models')

describe("Transfer", () => {
  describe("Initial transfer with one credit card and account activated", () => {
    beforeEach(async () => {
      
    })
    afterEach(async () => {
      await models.Task.truncate({where: {}, cascade: true, restartIdentity:true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
          console.log('Deleted successfully');
        }
      }, function(err){
        console.log(err);
      });
    
      await models.User.truncate({where: {}, cascade: true, restartIdentity:true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
          console.log('Deleted successfully');
        }
      }, function(err){
        console.log(err);
      });
      
      await models.Assign.truncate({where: {}, cascade: true, restartIdentity:true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
          console.log('Deleted successfully');
        }
      }, function(err){
        console.log(err);
      });
      
      await models.Order.truncate({where: {}, cascade: true, restartIdentity:true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
          console.log('Deleted successfully');
        }
      }, function(err){
        console.log(err);
      });
      
      await models.Transfer.truncate({where: {}, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
          console.log('Deleted successfully');
        }
      }, function(err){
        console.log(err);
      });
      
    })
    it("should not create transfer with no orders", (done) => {
       createTask(agent).then( task => {
          const taskData = task.dataValues
          createAssign(agent, {taskId: taskData.id}).then( assign => {
          agent
            .post('/transfers/create')
            .send({
              taskId: taskData.id
            }).then( res => {
              expect(res.body).to.exist;
              expect(res.body.error).to.equal('No orders found')
              done();
            }).catch( e => {
              console.log('error on transfer', e)
              done(e)
            }
          )
        })
       }).catch( e => {
          console.log('error on createTask', e)
          done(e)
        }
      )
    })
    it("should not create a transfer with no user assigned", (done) => {
      createTask(agent).then( task => {
         const taskData = task.dataValues
         agent
           .post('/transfers/create')
           .send({
             taskId: taskData.id
           }).then( res => {
             expect(res.body).to.exist;
             expect(res.body.error).to.equal('No user assigned')
             done();
           }).catch( e => {
             console.log('error on transfer', e)
             done(e)
           }
         )
      }).catch( e => {
         console.log('error on createTask', e)
         done(e)
       }
     )
   })
    it("should create transfer with a single order", (done) => {
      createTask(agent).then( task => {
         const taskData = task.dataValues
         createOrder({userId: taskData.userId, TaskId: taskData.id}).then( order => {
          createAssign(agent, {taskId: taskData.id}).then( assign => {
          agent
            .post('/transfers/create')
            .send({
              taskId: taskData.id
            }).then( res => {
              expect(res.body).to.exist;
              expect(res.body.status).to.equal('pending')
              expect(res.body.value).to.equal('200')
              done();
            }).catch( e => {
              console.log('error on transfer', e)
              done(e)
            }
          )
        })
        })
      }).catch( e => {
         console.log('error on createTask', e)
         done(e)
       }
     )
    })
    it("should search transfers", (done) => {
      createTask(agent).then( task => {
        const taskData = task.dataValues
        createOrder({userId: taskData.userId, TaskId: taskData.id}).then( order => {
          createAssign(agent, {taskId: taskData.id}).then( assign => {
            createTransfer({taskId: taskData.id}).then( transfer => {
              agent
                .get('/transfers/search')
                .query({})
                .then( res => {
                  console.log('res body transfer search', res.body)
                  expect(res.body).to.exist;
                  expect(res.body.length).to.equal(1)
                  done();
                }).catch( e => {
                  console.log('error on transfer', e)
                  done(e)
                }
              )
            })
          }).catch( e => {
            console.log('error on transfer', e)
            done(e)
          })
        })
      }).catch( e => {
        console.log('error on createTask', e)
        done(e)
      })
    })
    
    it("should not create transfers with same id", (done) => {
      createTask(agent).then( task => {
         const taskData = task.dataValues
         createOrder({userId: taskData.userId, TaskId: taskData.id}).then( order => {
          createAssign(agent, {taskId: taskData.id}).then( assign => {
          agent
            .post('/transfers/create')
            .send({
              taskId: taskData.id,
              transfer_id: '123'
            }).then( res1 => {
              agent
                .post('/transfers/create')
                .send({
                  taskId: taskData.id,
                  transfer_id: '123'
                }).then( res2 => {
                  expect(res2.body).to.exist;
                  expect(res2.body.error).to.equal('This transfer already exists')
                  done();
                }).catch( e => {
                  console.log('error on transfer', e)
                  done(e)
                }
              )
            }).catch( e => {
              console.log('error on transfer', e)
              done(e)
            }
          )
        })
        })
      }).catch( e => {
         console.log('error on createTask', e)
         done(e)
       }
     )
    })
    it("should not create transfers with same taskId", (done) => {
      createTask(agent).then( task => {
         const taskData = task.dataValues
         createOrder({userId: taskData.userId, TaskId: taskData.id}).then( order => {
          createAssign(agent, {taskId: taskData.id}).then( assign => {
          agent
            .post('/transfers/create')
            .send({
              taskId: taskData.id
            }).then( res1 => {
              agent
                .post('/transfers/create')
                .send({
                  taskId: taskData.id,
                  transfer_id: '12345'
                }).then( res2 => {
                  expect(res2.body).to.exist;
                  expect(res2.body.error).to.equal('Only one transfer for an issue')
                  done();
                }).catch( e => {
                  console.log('error on transfer', e)
                  done(e)
                }
              )
            }).catch( e => {
              console.log('error on transfer', e)
              done(e)
            }
          )
        })
        })
      }).catch( e => {
         console.log('error on createTask', e)
         done(e)
       }
     )
    })
  })
})