'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { registerAndLogin, createTask, createOrder, createAssign } = require('./helpers')
const { create } = require('core-js/core/object')
const models = require('../models')

describe("Transfer", () => {
  describe("Initial transfer with one credit card and account activated", () => {
    beforeEach(async () => {
      
    })
    afterEach(() => {
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
      models.Transfer.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
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
  })
})