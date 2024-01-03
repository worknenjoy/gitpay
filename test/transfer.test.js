'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { registerAndLogin, createTask } = require('./helpers')
const { create } = require('core-js/core/object')

describe("Transfer", () => {
  describe("Initial transfer with one credit card and account activated", () => {
    beforeEach(async () => {
      
    })
    afterEach(() => {
      
    })
    it("should not create transfer with no orders", (done) => {
       createTask(agent).then( task => {
          const taskData = task.dataValues
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
       }).catch( e => {
          console.log('error on createTask', e)
          done(e)
        }
      )
    })
  })
})