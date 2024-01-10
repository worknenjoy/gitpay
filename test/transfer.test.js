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
    it("should not create transfer with no orders", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id
          });
        expect(res.body).to.exist;
        expect(res.body.error).to.equal('No orders found');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should not create a transfer with no user assigned", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const res = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id
          });
        expect(res.body).to.exist;
        expect(res.body.error).to.equal('No user assigned');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should not create transfer with no paid order", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id
          });
        expect(res.body).to.exist;
        expect(res.body.error).to.equal('All orders must be paid');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should create transfer with a single order with stripe", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id
          });
        expect(res.body).to.exist;
        expect(res.body.status).to.equal('pending');
        expect(res.body.value).to.equal('200');
        expect(res.body.transfer_method).to.equal('stripe');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should search transfers", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const transfer = await createTransfer({taskId: taskData.id});
        const res = await agent
          .get('/transfers/search')
          .query({});
        console.log('res body transfer search', res.body);
        expect(res.body).to.exist;
        expect(res.body.length).to.equal(1);
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should not create transfers with same id", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res1 = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id,
            transfer_id: '123'
          });
        const res2 = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id,
            transfer_id: '123'
          });
        expect(res2.body).to.exist;
        expect(res2.body.error).to.equal('This transfer already exists');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should not create transfers with same taskId", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res1 = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id
          });
        const res2 = await agent
          .post('/transfers/create')
          .send({
            taskId: taskData.id,
            transfer_id: '12345'
          });
        expect(res2.body).to.exist;
        expect(res2.body.error).to.equal('Only one transfer for an issue');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
  })
})