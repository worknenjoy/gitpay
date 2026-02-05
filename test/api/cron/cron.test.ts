import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels, createTask, createOrder } from '../../helpers'
import nock from 'nock'
import request from 'supertest'
import { TaskCron, OrderCron } from '../../../src/crons/cron'
import MockDate from 'mockdate'
import paypalOrder from '../../data/paypal/paypal.order'

const agent = request.agent(api)
const models = Models as any

describe('Cron Jobs', () => {
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

  describe('Order', () => {
    it('should update order status when payment expired on Paypal', async () => {
      const task = await createTask(agent)
      const { body: taskData } = task
      const order = await createOrder({
        source_id: '123',
        userId: taskData.userId,
        taskId: taskData.id,
        provider: 'paypal',
        status: 'succeeded',
        paid: true
      })
      const orderData = order
      nock('https://api.sandbox.paypal.com')
        .persist()
        .post(`/v1/oauth2/token`)
        .reply(200, '{"access_token": "123"}')

      nock('https://api.sandbox.paypal.com')
        .persist()
        .get(`/v2/checkout/orders/${orderData.source_id}`)
        .reply(200, paypalOrder.resource_not_found)

      await OrderCron.checkExpiredPaypalOrders()
      const updatedOrder = await models.Order.findOne({ where: { id: orderData.id } })
      expect(updatedOrder.status).to.equal('expired')
      expect(updatedOrder.paid).to.equal(false)
    })
    it('should update order status when payment authorization expired after one month on Paypal', async () => {
      const task = await createTask(agent)
      const { body: taskData } = task
      const order = await createOrder({
        source_id: '123',
        userId: taskData.userId,
        taskId: taskData.id,
        provider: 'paypal',
        status: 'succeeded',
        paid: true
      })
      const orderData = order
      nock('https://api.sandbox.paypal.com')
        .persist()
        .post(`/v1/oauth2/token`)
        .reply(200, '{"access_token": "123"}')

      nock('https://api.sandbox.paypal.com')
        .persist()
        .get(`/v2/checkout/orders/${orderData.source_id}`)
        .reply(200, paypalOrder.authorization_expired)

      await OrderCron.checkExpiredPaypalOrders()
      const updatedOrder = await models.Order.findOne({ where: { id: orderData.id } })
      expect(updatedOrder.status).to.equal('expired')
      expect(updatedOrder.paid).to.equal(false)
    })
  })
  describe('Task', () => {
    xit('Remember about tasks with bounty invested weekly', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'testcronbasic@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)

      MockDate.set('2000-11-25')
      const tasks = await Promise.all([
        models.Task.build({
          url: 'https://github.com/worknenjoy/truppie/issues/7363',
          userId: res.body.id
        }).save(),
        models.Task.build({
          url: 'https://github.com/worknenjoy/truppie/issues/7364',
          userId: res.body.id,
          status: 'in_progress'
        }).save(),
        models.Task.build({
          url: 'https://github.com/worknenjoy/truppie/issues/7365',
          userId: res.body.id,
          status: 'closed',
          value: 100
        }).save(),
        models.Task.build({
          url: 'https://github.com/worknenjoy/truppie/issues/7366',
          userId: res.body.id
        }).save(),
        models.Task.build({
          url: 'https://github.com/worknenjoy/truppie/issues/7367',
          userId: res.body.id,
          value: 50
        }).save()
      ])
      expect(tasks[0].url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
      expect(tasks[2].value).to.equal('100')
      const r = await TaskCron.weeklyBounties()
      expect(r.length).to.equal(1)
      expect(r[0]).to.exist
      expect(r[0].url).to.equal('https://github.com/worknenjoy/truppie/issues/7367')
      MockDate.reset()
    })
  })
  xit('Remember about latest tasks weekly', async () => {
    const res = await agent
      .post('/auth/register')
      .send({ email: 'testcronbasic@gmail.com', password: 'teste' })
      .expect('Content-Type', /json/)
      .expect(200)

    const tasks = await Promise.all([
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7363',
        userId: res.body.id
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7364',
        userId: res.body.id,
        status: 'in_progress'
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7365',
        userId: res.body.id,
        status: 'closed',
        value: 100
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7366',
        userId: res.body.id
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7367',
        userId: res.body.id,
        value: 50
      }).save()
    ])

    expect(tasks[0].url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
    expect(tasks[2].value).to.equal('100')
    const r = await TaskCron.latestTasks()
    expect(r.length).to.equal(3)
    expect(r[0]).to.exist
    expect(r[0].url).to.equal('https://github.com/worknenjoy/truppie/issues/7367')
    expect(r[2].url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
  })
  xit('Paypal payment was canceled notification when we cannot fetch order', async () => {
    const res = await agent
      .post('/auth/register')
      .send({ email: 'testcronbasic@gmail.com', password: 'teste' })
      .expect('Content-Type', /json/)
      .expect(200)

    const task = await models.Task.build({
      url: 'https://github.com/worknenjoy/truppie/issues/7363',
      userId: res.body.id
    }).save()

    const orders = await Promise.all([
      models.Order.build({
        amount: 60,
        userId: res.body.id,
        status: 'open',
        taskId: task.id
      }).save(),
      models.Order.build({
        amount: 80,
        userId: res.body.id,
        taskId: task.id,
        status: 'canceled'
      }).save(),
      models.Order.build({
        amount: 20,
        userId: res.body.id,
        source_id: 'foo',
        taskId: task.id,
        status: 'succeeded',
        paid: true,
        provider: 'paypal'
      }).save(),
      models.Order.build({ amount: 20, userId: res.body.id }).save(),
      models.Order.build({ amount: 20, userId: res.body.id }).save()
    ])
    expect(orders[0].id).to.exist
    const r = await OrderCron.verify()
    expect(r.length).to.equal(1)
    expect(r[0]).to.exist
    expect(r[0].status).to.equal('canceled')
  })
  xit('Send email about bounties', async () => {
    const res = await agent
      .post('/auth/register')
      .send({ email: 'testcronbasic@gmail.com', password: 'teste' })
      .expect('Content-Type', /json/)
      .expect(200)

    const task = await models.Task.build({
      url: 'https://github.com/worknenjoy/truppie/issues/7363',
      userId: res.body.id
    }).save()
    expect(task.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
  })
  xit('remember deadline 2 days left', async () => {
    const res = await agent
      .post('/auth/register')
      .send({ email: 'testcrondeadline@gmail.com', password: 'teste' })
      .expect('Content-Type', /json/)
      .expect(200)

    MockDate.set('2000-11-25')
    const task = await models.Task.build({
      deadline: new Date('2000-11-24'),
      url: 'https://github.com/worknenjoy/truppie/issues/7336',
      userId: res.body.id,
      status: 'in_progress'
    }).save()

    const assign = await task.createAssign({ userId: res.body.id })
    const taskUpdated = await task.update({
      assigned: assign.id
    })
    const r = await TaskCron.rememberDeadline()
    expect(r[0]).to.exist
    expect(r[0].url).to.equal(
      'https://github.com/worknenjoy/truppie/issues/7336'
    )
    MockDate.reset()

    xit('remember deadline 2 days past', async () => {
      const res = await agent
        .post('/auth/register')
        .send({ email: 'testcrondeadline2@gmail.com', password: 'teste' })
        .expect('Content-Type', /json/)
        .expect(200)

      MockDate.set('2000-11-25')
      const task = await models.Task.build({
        deadline: new Date('2000-11-27'),
        url: 'https://github.com/worknenjoy/truppie/issues/7336',
        userId: res.body.id,
        status: 'in_progress'
      }).save()

      const assign = await task.createAssign({ userId: res.body.id })
      const taskUpdated = await task.update({
        assigned: assign.id
      })
      const r = await TaskCron.rememberDeadline()
      expect(r[0]).to.exist
      expect(r[0].url).to.equal('https://github.com/worknenjoy/truppie/issues/7336')
      MockDate.reset()
    })
  })
})
