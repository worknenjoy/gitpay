'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../server')
const agent = request.agent(api)
const nock = require('nock')
const { createTask, createOrder, createAssign, createTransfer, truncateModels } = require('./helpers')
const models = require('../models')
const transfer = require('./data/transfer').transfer.data.object

// Common function to create transfer
const createTransferWithTaskData = async (taskData, userId, transferId) => {
  const res = await agent
    .post('/transfers/create')
    .send({
      taskId: taskData.id,
      userId: userId,
      transfer_id: transferId
    });
  return res;
}

describe("Transfer", () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
  })
  afterEach(async () => {
    nock.cleanAll()
  })
  describe("Initial transfer with one credit card and account activated", () => {
    it("should not create transfer with no orders", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await createTransferWithTaskData(taskData, taskData.userId);
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
        const res = await createTransferWithTaskData(taskData, taskData.userId);
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
        const res = await createTransferWithTaskData(taskData, taskData.userId);
        expect(res.body).to.exist;
        expect(res.body.error).to.equal('All orders must be paid');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should create transfer with a single order paid with stripe", async () => {
      try {
        await nock('https://api.stripe.com')
          .persist()  
          .post('/v1/transfers')
          .reply(200, transfer );
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await createTransferWithTaskData(taskData, taskData.userId);
        expect(res.body).to.exist;
        expect(res.body.status).to.equal('in_transit');
        expect(res.body.value).to.equal('200');
        expect(res.body.transfer_method).to.equal('stripe');
        expect(res.body.transfer_id).to.exist;
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should create transfer with two orders paid with stripe", async () => {
      try {
        await nock('https://api.stripe.com')
          .persist()  
          .post('/v1/transfers')
          .reply(200, transfer );
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const anotherOrder = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await createTransferWithTaskData(taskData, taskData.userId);
        expect(res.body).to.exist;
        expect(res.body.status).to.equal('in_transit');
        expect(res.body.value).to.equal('400');
        expect(res.body.transfer_method).to.equal('stripe');
        expect(res.body.transfer_id).to.exist;
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should create transfer with three mulltiple orders paid with stripe", async () => {
      try {
        await nock('https://api.stripe.com')
          .persist()  
          .post('/v1/transfers')
          .reply(200, transfer );
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const anotherOrder = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: false, provider: 'stripe'});
        const oneMoreOrder = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const res = await createTransferWithTaskData(taskData, taskData.userId);
        expect(res.body).to.exist;
        expect(res.body.status).to.equal('in_transit');
        expect(res.body.value).to.equal('400');
        expect(res.body.transfer_method).to.equal('stripe');
        expect(res.body.transfer_id).to.exist;
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
    it("should create transfer with three mulltiple orders paid with stripe and paypal", async () => {
      await nock('https://api.stripe.com')
        .persist()  
        .post('/v1/transfers')
        .reply(200, transfer );
      const task = await createTask(agent);
      const taskData = task.dataValues;
      const order = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
      const anotherOrder = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: true, provider: 'stripe'});
      const oneMoreOrder = await createOrder({userId: taskData.userId, TaskId: taskData.id, paid: false, provider: 'paypal'});
      const assign = await createAssign(agent, {taskId: taskData.id});
      const res = await createTransferWithTaskData(taskData, taskData.userId);
      expect(res.body).to.exist;
      expect(res.body.status).to.equal('in_transit');
      expect(res.body.value).to.equal('400');
      expect(res.body.transfer_method).to.equal('multiple');
      expect(res.body.transfer_id).to.exist;
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5');
    })
    it("should search transfers", async () => {
      try {
        const task = await createTask(agent);
        const taskData = task.dataValues;
        const order = await createOrder({userId: taskData.userId, TaskId: taskData.id});
        const assign = await createAssign(agent, {taskId: taskData.id});
        const transfer = await createTransfer({taskId: taskData.id, userId: taskData.userId, to: assign.dataValues.userId});
        const res = await agent
          .get('/transfers/search')
          .query({userId: taskData.userId});
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
        const res1 = await createTransferWithTaskData(taskData, taskData.userId, '123');
        const res2 = await createTransferWithTaskData(taskData, undefined, '123');
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
        const res1 = await createTransferWithTaskData(taskData, taskData.userId);
        const res2 = await createTransferWithTaskData(taskData, taskData.userId);
        expect(res2.body).to.exist;
        expect(res2.body.error).to.equal('Only one transfer for an issue');
      } catch (e) {
        console.log('error on transfer', e);
        throw e;
      }
    })
  })
})
