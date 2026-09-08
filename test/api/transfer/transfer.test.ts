import assert from 'assert'
import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import jwt from 'jsonwebtoken'
import api from '../../../src/server'
import nock from 'nock'
import { USER_SENSITIVE_ATTRIBUTES } from '../../../src/queries/user/userSensitiveAttributes'
import {
  createTask,
  createOrder,
  createAssign,
  createTransfer,
  registerAndLogin,
  truncateModels
} from '../../helpers'
import { UserFactory, AssignFactory } from '../../factories'
import Models from '../../../src/models'
const models = Models as any
import { updated } from '../../data/stripe/stripe.transfer.updated'
const transfer = updated.data.object
import { get as paypalGetPayoutSample } from '../../data/paypal/paypal.payout'

const agent = request.agent(api)

// Mints a valid session token for a user created directly via a factory
// (bypassing register/activate/login) so authorization edge cases (a user
// with no account_id/paypal_id set) can still be exercised as themselves.
const tokenFor = (userId: number) => `Bearer ${jwt.sign({ id: userId }, process.env.SECRET_PHRASE as string)}`

// Registers and logs in a new user, assigns them to the task as its claimer
// (mirrors what taskSolutionCreate does when a claim is verified), and
// returns their auth header alongside the assign row.
const makeClaimer = async (taskId: number, userParams: any = {}) => {
  const claimer = await registerAndLogin(agent, {
    account_id: 'acct_1Gqj2tGjYvP2Yx5R',
    ...userParams
  })
  const assign = await AssignFactory(
    { TaskId: taskId, userId: claimer!.body.id },
    { include: [models.User] }
  )
  await models.Task.update({ assigned: assign.dataValues.id }, { where: { id: taskId } })
  return { ...claimer!, assign: assign.dataValues }
}

// Common function to create transfer
const createTransferWithTaskData = async (
  taskData: any,
  authHeader: string,
  transferId?: string
): Promise<any> => {
  const res = await agent
    .post('/transfers/create')
    .set('Authorization', authHeader)
    .send({
      taskId: taskData.id,
      transfer_id: transferId
    })
  return res
}

describe('/transfers without a session', () => {
  it('rejects unauthenticated search', async () => {
    const res = await agent.get('/transfers/search').query({ userId: 1 })
    expect(res.statusCode).to.equal(403)
  })

  it('rejects unauthenticated fetch', async () => {
    const res = await agent.get('/transfers/fetch/1')
    expect(res.statusCode).to.equal(403)
  })

  it('rejects unauthenticated create', async () => {
    const res = await agent.post('/transfers/create').send({ taskId: 1 })
    expect(res.statusCode).to.equal(403)
  })

  it('rejects unauthenticated update', async () => {
    const res = await agent.put('/transfers/update').send({ id: 1 })
    expect(res.statusCode).to.equal(403)
  })
})

describe('POST /transfer', () => {
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
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
        const { body: taskData, headers } = task!
        const res = await createTransferWithTaskData(taskData, headers.authorization)
        expect(res.body).to.exist
        expect(res.body.error).to.equal('No user assigned')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should not create transfer with no paid order', async () => {
      try {
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const anotherOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
    it('should create transfer with three multiple orders paid with stripe', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const anotherOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: false,
          provider: 'stripe'
        })
        const oneMoreOrder = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
    it('should create transfer with three multiple orders paid with stripe and paypal but paypal not paid', async () => {
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'paypal'
      })
      const claimer = await makeClaimer(taskData.id)
      const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
          'Content-Type': 'application/json'
        }
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
                email_message: 'You have received a payout! Thanks for using our service!'
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING'
            }
          },
          {
            'Content-Type': 'application/json'
          }
        )

      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'stripe'
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal'
      })
      const claimer = await makeClaimer(taskData.id, { paypal_id: 'foo@example.com' })
      const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
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
      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData, headers } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const claimer = await makeClaimer(taskData.id)
      const transferData = await createTransferWithTaskData(taskData, claimer.headers.authorization)
      const res = await agent
        .put('/transfers/update')
        .set('Authorization', headers.authorization)
        .send({
          id: transferData.body.id
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
          'Content-Type': 'application/json'
        }
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
                email_message: 'You have received a payout! Thanks for using our service!'
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING'
            }
          },
          {
            'Content-Type': 'application/json'
          }
        )

      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json'
      })

      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)

      nock('https://api.stripe.com').persist().get('/v1/transfers').reply(200, transfer)

      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData, headers } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal'
      })
      const claimer = await makeClaimer(taskData.id, { paypal_id: '123' })
      const transferData = await createTransferWithTaskData(taskData, claimer.headers.authorization)
      const updateAssign = await models.User.update(
        {
          paypal_id: 'test'
        },
        {
          where: {
            id: claimer.assign.userId
          }
        }
      )
      const res = await agent
        .put('/transfers/update')
        .set('Authorization', headers.authorization)
        .send({
          id: transferData.body.id
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
          'Content-Type': 'application/json'
        }
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
                email_message: 'You have received a payout! Thanks for using our service!'
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING'
            }
          },
          {
            'Content-Type': 'application/json'
          }
        )

      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json'
      })
      nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
      nock('https://api.stripe.com').persist().get('/v1/transfers').reply(200, transfer)
      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData, headers } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal'
      })
      const claimer = await makeClaimer(taskData.id, { paypal_id: 'foo' })
      const transferData = await createTransferWithTaskData(taskData, claimer.headers.authorization)
      const res = await agent
        .put('/transfers/update')
        .set('Authorization', headers.authorization)
        .send({
          id: transferData.body.id
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
      const { body: taskData, headers } = task!
      const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
      const assign = await createAssign(agent, { taskId: taskData.id })
      const transfer = await createTransfer({
        taskId: taskData.id,
        userId: taskData.userId,
        to: assign.userId
      })
      const res = await agent
        .get('/transfers/search')
        .set('Authorization', headers.authorization)
        .query({ userId: taskData.userId })
      expect(res.body).to.exist
      expect(res.body.length).to.equal(1)
      if (res.body[0].User) {
        for (const field of USER_SENSITIVE_ATTRIBUTES) {
          expect(res.body[0].User).to.not.have.property(field)
        }
      }
    })
    it('does not return another user\'s transfers on search', async () => {
      const task = await createTask(agent)
      const { body: taskData } = task!
      const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
      const assign = await createAssign(agent, { taskId: taskData.id })
      await createTransfer({
        taskId: taskData.id,
        userId: taskData.userId,
        to: assign.userId
      })
      const stranger = await registerAndLogin(agent)
      const res = await agent
        .get('/transfers/search')
        .set('Authorization', stranger!.headers.authorization)
        .query({ userId: taskData.userId })
      expect(res.body).to.deep.equal([])
    })
    it('should fetch transfer', async () => {
      nock('https://api.stripe.com').persist().get('/v1/transfers/1234').reply(200, transfer)
      try {
        const task = await createTask(agent)
        const { body: taskData, headers } = task!
        const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
        const assign = await createAssign(agent, { taskId: taskData.id })
        const transfer = await createTransfer({
          taskId: taskData.id,
          userId: taskData.userId,
          to: assign.userId
        })
        const transferId = transfer.id
        const res = await agent
          .get('/transfers/fetch/' + transferId)
          .set('Authorization', headers.authorization)
        expect(res.body).to.exist
        expect(res.body.id).to.equal(transferId)
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('404s fetching a transfer that belongs to someone else', async () => {
      const task = await createTask(agent)
      const { body: taskData } = task!
      const order = await createOrder({ userId: taskData.userId, TaskId: taskData.id })
      const assign = await createAssign(agent, { taskId: taskData.id })
      const transfer = await createTransfer({
        taskId: taskData.id,
        userId: taskData.userId,
        to: assign.userId
      })
      const stranger = await registerAndLogin(agent)
      const res = await agent
        .get('/transfers/fetch/' + transfer.id)
        .set('Authorization', stranger!.headers.authorization)
      expect(res.statusCode).to.equal(404)
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
          'Content-Type': 'application/json'
        }
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
                email_message: 'You have received a payout! Thanks for using our service!'
              },
              payout_batch_id: '5UXD2E8A7EBQJ',
              batch_status: 'PENDING'
            }
          },
          {
            'Content-Type': 'application/json'
          }
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
          'Content-Type': 'application/json'
        }
      )
      nock(url).get(getPayoutPath).reply(200, paypalGetPayoutSample, {
        'Content-Type': 'application/json'
      })

      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData, headers } = task!
      const order = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const anotherOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: false,
        provider: 'stripe'
      })
      const oneMoreOrder = await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'paypal'
      })
      const claimer = await makeClaimer(taskData.id, { paypal_id: 'foo@example.com' })
      const createTransferRes = await createTransferWithTaskData(
        taskData,
        claimer.headers.authorization
      )
      const res = await agent
        .get('/transfers/fetch/' + createTransferRes.body.id)
        .set('Authorization', headers.authorization)
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
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true
        })
        const claimer = await makeClaimer(taskData.id)
        const res1 = await createTransferWithTaskData(taskData, claimer.headers.authorization, '123')
        const res2 = await createTransferWithTaskData(taskData, claimer.headers.authorization, '123')
        expect(res2.body).to.exist
        expect(res2.body.error).to.equal('This transfer already exists')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should not create transfers with same taskId', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(200, transfer)
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        const order = await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true
        })
        const claimer = await makeClaimer(taskData.id)
        const res1 = await createTransferWithTaskData(taskData, claimer.headers.authorization)
        const res2 = await createTransferWithTaskData(taskData, claimer.headers.authorization)
        expect(res2.body).to.exist
        expect(res2.body.error).to.equal('Only one transfer for an issue')
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('rejects create from a user who is not the assigned claimer', async () => {
      const task = await createTask(agent, { status: 'closed' })
      const { body: taskData } = task!
      await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      await makeClaimer(taskData.id)
      const stranger = await registerAndLogin(agent)
      const res = await createTransferWithTaskData(taskData, stranger!.headers.authorization)
      expect(res.body).to.exist
      expect(res.body.error).to.equal('Not authorized')
    })
    it('rejects create when the task is not yet closed, even for the assigned claimer', async () => {
      const task = await createTask(agent)
      const { body: taskData } = task!
      await createOrder({
        userId: taskData.userId,
        TaskId: taskData.id,
        paid: true,
        provider: 'stripe'
      })
      const claimer = await makeClaimer(taskData.id)
      const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
      expect(res.body).to.exist
      expect(res.body.error).to.equal('Not authorized')
    })
    it('should create pending transfer when assigned user has no Stripe account_id', async () => {
      try {
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const assignUser = await UserFactory({ name: 'No Account User' })
        const assign = await AssignFactory(
          { TaskId: taskData.id, userId: assignUser.id },
          { include: [models.User] }
        )
        await models.Task.update({ assigned: assign.id }, { where: { id: taskData.id } })
        const res = await createTransferWithTaskData(taskData, tokenFor(assignUser.id))
        expect(res.body).to.exist
        expect(res.body.status).to.equal('pending')
        expect(res.body.transfer_method).to.equal('stripe')
        expect(res.body.comment).to.equal('Stripe: no account connected')
        expect(res.body.transfer_id).to.be.null
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create pending transfer when Stripe returns insufficient_capabilities_for_transfer', async () => {
      try {
        nock('https://api.stripe.com').persist().post('/v1/transfers').reply(400, {
          error: {
            type: 'invalid_request_error',
            code: 'insufficient_capabilities_for_transfer',
            message: 'This account does not have the capability to transfer funds.'
          }
        })
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'stripe'
        })
        const claimer = await makeClaimer(taskData.id)
        const res = await createTransferWithTaskData(taskData, claimer.headers.authorization)
        expect(res.body).to.exist
        expect(res.body.status).to.equal('pending')
        expect(res.body.transfer_method).to.equal('stripe')
        expect(res.body.comment).to.include('insufficient capabilities')
        expect(res.body.transfer_id).to.be.null
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
    it('should create pending transfer for PayPal-only payment when user has no paypal_id', async () => {
      try {
        const task = await createTask(agent, { status: 'closed' })
        const { body: taskData } = task!
        await createOrder({
          userId: taskData.userId,
          TaskId: taskData.id,
          paid: true,
          provider: 'paypal'
        })
        const assignUser = await UserFactory({ name: 'No PayPal User' })
        const assign = await AssignFactory(
          { TaskId: taskData.id, userId: assignUser.id },
          { include: [models.User] }
        )
        await models.Task.update({ assigned: assign.id }, { where: { id: taskData.id } })
        const res = await createTransferWithTaskData(taskData, tokenFor(assignUser.id))
        expect(res.body).to.exist
        expect(res.body.status).to.equal('pending')
        expect(res.body.transfer_method).to.equal('paypal')
        expect(res.body.comment).to.equal('PayPal: no PayPal account connected')
        expect(res.body.paypal_payout_id).to.be.null
      } catch (e) {
        console.log('error on transfer', e)
        throw e
      }
    })
  })
})
