'use strict'
const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const api = require('../src/server').default
const agent = request.agent(api)
const nock = require('nock')
const {
  createTask,
  createOrder,
  createAssign,
  createTransfer,
  truncateModels,
} = require('./helpers')
const models = require('../src/models')
const transfer = require('./data/stripe/stripe.transfer.updated').updated.data.object
const paypalGetPayoutSample = require('./data/paypal/paypal.payout').get

// Common function to create transfer
const createTransferWithTaskData = async (taskData, userId, transferId) => {
  const res = await agent.post('/transfers/create').send({
    taskId: taskData.id,
    userId: userId,
    transfer_id: transferId,
  })
  return res
}

describe('Transfer', () => {
  describe('Initial transfer with one credit card and account activated', () => {
    beforeEach(async () => {
      await truncateModels(models.Task)
      await truncateModels(models.User)
      await truncateModels(models.Assign)
      await truncateModels(models.Order)
      await truncateModels(models.Transfer)
    })
    afterEach(async () => {
      nock.cleanAll()
    })
    it('should not create transfer with no orders', async () => {
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.error).to.equal('No orders found')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should not create a transfer with no user assigned', async () => {
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.error).to.equal('No user assigned')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should not create transfer with no paid order', async () => {
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.error).to.equal('All orders must be paid')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create transfer with a single order paid with stripe', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
        })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.status).to.equal('in_transit')
        expect(res.body.value).to.equal('200')
        expect(res.body.transfer_method).to.equal('stripe')
        expect(res.body.transfer_id).to.exist
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create transfer with two orders paid with stripe', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
        })
        const anotherOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
        })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.status).to.equal('in_transit')
        expect(res.body.value).to.equal('400')
        expect(res.body.transfer_method).to.equal('stripe')
        expect(res.body.transfer_id).to.exist
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create transfer with three mulltiple orders paid with stripe', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
        })
        const anotherOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: false,
          provider: 'stripe',
        })
        const oneMoreOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe',
        })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res.body).to.exist
        expect(res.body.status).to.equal('in_transit')
        expect(res.body.value).to.equal('400')
        expect(res.body.transfer_method).to.equal('stripe')
        expect(res.body.transfer_id).to.exist
        expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create transfer with three mulltiple orders paid with stripe and paypal but paypal not paid', async () => {
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'paypal',
      })
      const assign = await createAssign(agent, { taskId: taskData.id })
      const res = await createTransferWithTaskData(taskData, taskData.userId)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('400')
      expect(res.body.transfer_method).to.equal('stripe')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
    })
    it('should create transfer with three mulltiple orders paid with stripe and paypal with two orders paid in multiple methods', async () => {
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)

      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const anotherPath = '/v1/payments/payouts'
      nock(url).post(path).reply(
        200,
        { access_token: 'foo' },
        {
          'Content-Type': 'application/json',
        },
      )
      nock(url)
        .post(anotherPath)
        .reply(
          200,
          {
            batch_header: {
              sender_batch_header: {
                sender_batch_id: 'Payouts_2020_100007',
                email_subject: 'You have a payout!',
                email_message: 'You have received a payout! Thanks for using our service!',
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING',
            },
          },
          {
            'Content-Type': 'application/json',
          },
        )

      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'stripe',
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal',
      })
      const assign = await createAssign(
        agent,
        { taskId: taskData.id },
        { paypal_id: 'foo@example.com' },
      )
      const res = await createTransferWithTaskData(taskData, taskData.userId)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('400')
      expect(res.body.transfer_method).to.equal('multiple')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      expect(res.body.paypal_payout_id).to.equal('5UXD2E8A7EBQJ')
      expect(res.body.stripe_transfer_amount).to.equal('200')
      expect(res.body.paypal_transfer_amount).to.equal('200')

      const payouts = await models.Payout.findAll()
      expect(payouts.length).to.equal(1)
      expect(payouts[0].source_id).to.equal('5UXD2E8A7EBQJ')
    })
    it('should update transfer pending to created for a pending transfer for an activated account', async () => {
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
      nock('https://api.stripe.com').persist().get('/v1/transfers').reply(200, transfer)
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const assign = await createAssign(agent, { taskId: taskData.id })
      const transferData = await createTransferWithTaskData(taskData, taskData.userId)
      const res = await agent.put('/transfers/update').send({
        id: transferData.body.id,
      })
      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('200')
      expect(res.body.transfer_method).to.equal('stripe')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
    })
    it('should update transfer pending to created for a pending transfer for an activated account with multiple payments', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const newPayoutPath = '/v1/payments/payouts'
      const getPayoutPath = '/v1/payments/payouts/5UXD2E8A7EBQJ'

      nock(url).post(path).reply(
        200,
        { access_token: 'foo' },
        {
          'Content-Type': 'application/json',
        },
      )
      nock(url)
        .post(newPayoutPath)
        .reply(
          200,
          {
            batch_header: {
              sender_batch_header: {
                sender_batch_id: 'Payouts_2020_100007',
                email_subject: 'You have a payout!',
                email_message: 'You have received a payout! Thanks for using our service!',
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING',
            },
          },
          {
            'Content-Type': 'application/json',
          },
        )

      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json',
      })

      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)

      nock('https://api.stripe.com').persist().get('/v1/transfers').reply(200, transfer)

      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal',
      })
      const assign = await createAssign(agent, { taskId: taskData.id }, { paypal_id: '123' })
      const transferData = await createTransferWithTaskData(taskData, taskData.userId)
      const updateAssign = await models.User.update(
        {
          paypal_id: 'test',
        },
        {
          where: {
            id: assign.dataValues.userId,
          },
        },
      )
      const res = await agent.put('/transfers/update').send({
        id: transferData.body.id,
      })
      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('400')
      expect(res.body.transfer_method).to.equal('multiple')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      expect(res.body.paypal_payout_id).to.exist
    })
    it('should update transfer pending to created and update value for a pending transfer for an activated account for multiple payments', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const newPayoutPath = '/v1/payments/payouts'
      const getPayoutPath = '/v1/payments/payouts/5UXD2E8A7EBQJ'

      nock(url).post(path).reply(
        200,
        { access_token: 'foo' },
        {
          'Content-Type': 'application/json',
        },
      )
      nock(url)
        .post(newPayoutPath)
        .reply(
          200,
          {
            batch_header: {
              sender_batch_header: {
                sender_batch_id: 'Payouts_2020_100007',
                email_subject: 'You have a payout!',
                email_message: 'You have received a payout! Thanks for using our service!',
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING',
            },
          },
          {
            'Content-Type': 'application/json',
          },
        )

      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json',
      })
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
      nock('https://api.stripe.com').persist().get('/v1/transfers').reply(200, transfer)
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal',
      })
      const assign = await createAssign(agent, { taskId: taskData.id }, { paypal_id: 'foo' })
      const transferData = await createTransferWithTaskData(taskData, taskData.userId)
      const res = await agent.put('/transfers/update').send({
        id: transferData.body.id,
      })
      expect(res.status).to.equal(200)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('400')
      expect(res.body.transfer_method).to.equal('multiple')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
    })
    it('should search transfers', async () => {
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
      const assign = await createAssign(agent, { taskId: taskData.id })
      const transfer = await createTransfer({
        taskId: taskData.id,
        userId: taskData.userId,
        to: assign.dataValues.userId,
      })
      const res = await agent.get('/transfers/search').query({ userId: taskData.userId })
      expect(res.body).to.exist
      expect(res.body.length).to.equal(1)
    })
    it('should fetch transfer', async () => {
      nock('https://api.stripe.com').persist().get('/v1/transfers/1234').reply(200, transfer)
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const transfer = await createTransfer({
          taskId: taskData.id,
          userId: taskData.userId,
          to: assign.dataValues.userId,
        })
        const transferId = transfer.dataValues.id
        const res = await agent.get('/transfers/fetch/' + transferId)
        expect(res.body).to.exist
        expect(res.body.id).to.equal(transferId)
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should fetch transfer with a paypal associated payout', async () => {
      const url = 'https://api.sandbox.paypal.com'
      const path = '/v1/oauth2/token'
      const newPayoutPath = '/v1/payments/payouts'
      const getPayoutPath = '/v1/payments/payouts/5UXD2E8A7EBQJ'

      nock(url).post(path).reply(
        200,
        { access_token: 'foo' },
        {
          'Content-Type': 'application/json',
        },
      )
      nock(url)
        .post(newPayoutPath)
        .reply(
          200,
          {
            batch_header: {
              sender_batch_header: {
                sender_batch_id: 'Payouts_2020_100007',
                email_subject: 'You have a payout!',
                email_message: 'You have received a payout! Thanks for using our service!',
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING',
            },
          },
          {
            'Content-Type': 'application/json',
          },
        )

      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)

      nock('https://api.stripe.com')
        .persist()
        .get('/v1/transfers/tr_1CcGcaBrSjgsps2DGToaoNF5')
        .reply(200, transfer)

      nock(url).post(path).reply(
        200,
        { access_token: 'foo' },
        {
          'Content-Type': 'application/json',
        },
      )
      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json',
      })

      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe',
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'stripe',
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal',
      })
      const assign = await createAssign(
        agent,
        { taskId: taskData.id },
        { paypal_id: 'foo@example.com' },
      )
      const createTransfer = await createTransferWithTaskData(taskData, taskData.userId)
      const res = await agent.get('/transfers/fetch/' + createTransfer.body.id)
      expect(res.body).to.exist
      expect(res.body.status).to.equal('in_transit')
      expect(res.body.value).to.equal('400')
      expect(res.body.transfer_method).to.equal('multiple')
      expect(res.body.transfer_id).to.exist
      expect(res.body.transfer_id).to.equal('tr_1CcGcaBrSjgsps2DGToaoNF5')
      expect(res.body.paypal_payout_id).to.equal('5UXD2E8A7EBQJ')
      expect(res.body.paypalTransfer).to.exist
      expect(res.body.paypalTransfer.batch_header.payout_batch_id).to.equal('LEP6947CGTKRL')
      expect(res.body.paypalTransfer.batch_header.batch_status).to.equal('SUCCESS')
      expect(res.body.paypalTransfer.batch_header.amount.value).to.equal('200.0')

      expect(res.body.stripeTransfer.amount).to.equal(100)

      const payouts = await models.Payout.findAll()
      expect(payouts.length).to.equal(1)
      expect(payouts[0].source_id).to.equal('5UXD2E8A7EBQJ')
    })
    it('should not create transfers with same id', async () => {
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
        })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res1 = await createTransferWithTaskData(taskData, taskData.userId, '123')
        const res2 = await createTransferWithTaskData(taskData, undefined, '123')
        expect(res2.body).to.exist
        expect(res2.body.error).to.equal('This transfer already exists')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should not create transfers with same taskId', async () => {
      try {
        const task = await createTask(agent)
        const taskData = task.dataValues
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
        })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const res1 = await createTransferWithTaskData(taskData, taskData.userId)
        const res2 = await createTransferWithTaskData(taskData, taskData.userId)
        expect(res2.body).to.exist
        expect(res2.body.error).to.equal('Only one transfer for an issue')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
  })
})
