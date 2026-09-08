import request from 'supertest'
import { expect } from 'chai'
import chai from 'chai'
import spies from 'chai-spies'
import api from '../../../src/server'
import nock from 'nock'
import Models from '../../../src/models'
import { registerAndLogin, register, login, truncateModels } from '../../helpers'
import { TaskFactory, OrderFactory, WalletFactory, WalletOrderFactory } from '../../factories'
import PaymentMail from '../../../src/mail/payment'
import stripe from '../../../src/client/payment/stripe'
import customerData from '../../data/stripe/stripe.customer'
import invoiceData from '../../data/stripe/stripe.invoice.basic'

const agent = request.agent(api)
const models = Models as any

describe('POST /order/transfer', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Wallet)

    // PlanSchemas are required by order creation for "open source" plan.
    // They are not truncated above, so ensure they exist deterministically.
    await models.PlanSchema.findOrCreate({
      where: { plan: 'open source', name: 'Open Source - default', feeType: 'charge' },
      defaults: {
        plan: 'open source',
        name: 'Open Source - default',
        description: 'open source',
        fee: 8,
        feeType: 'charge'
      }
    })
    await models.PlanSchema.findOrCreate({
      where: { plan: 'open source', name: 'Open Source - no fee', feeType: 'charge' },
      defaults: {
        plan: 'open source',
        name: 'Open Source - no fee',
        description: 'open source with no fee',
        fee: 0,
        feeType: 'charge'
      }
    })
  })
  afterEach(async () => {
    nock.cleanAll()
  })

  it('should transfer a Stripe order', async () => {
    const user = await registerAndLogin(agent, { email: 'test_transfer_order@gitpay.me' })

    const tasks = await Promise.all([
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7363',
        userId: user.body.id
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/7364',
        userId: user.body.id,
        status: 'in_progress'
      }).save()
    ])

    const order = await models.Order.build({
      source_id: '12345',
      currency: 'BRL',
      amount: 200,
      TaskId: tasks[0].dataValues.id
    }).save()

    const transferRes = await agent
      .post(`/orders/${order.dataValues.id}/transfers`)
      .send({
        taskId: tasks[1].dataValues.id
      })
      .set('Authorization', user.headers.authorization)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(transferRes.statusCode).to.equal(200)
    expect(transferRes.body).to.exist
    expect(transferRes.body.source_id).to.equal('12345')
    expect(transferRes.body.currency).to.equal('BRL')
    expect(transferRes.body.amount).to.equal('200')
  })

  it('rejects a transfer request from someone who neither placed the order nor owns the task', async () => {
    const owner = await registerAndLogin(agent, { email: 'test_transfer_owner@gitpay.me' })

    const tasks = await Promise.all([
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/8363',
        userId: owner.body.id
      }).save(),
      models.Task.build({
        url: 'https://github.com/worknenjoy/truppie/issues/8364',
        userId: owner.body.id,
        status: 'in_progress'
      }).save()
    ])

    const order = await models.Order.build({
      source_id: '54321',
      currency: 'BRL',
      amount: 200,
      TaskId: tasks[0].dataValues.id
    }).save()

    const attacker = await registerAndLogin(agent, { email: 'test_transfer_attacker@gitpay.me' })

    const res = await agent
      .post(`/orders/${order.dataValues.id}/transfers`)
      .send({ taskId: tasks[1].dataValues.id })
      .set('Authorization', attacker.headers.authorization)

    expect(res.body.source_id).to.not.equal('54321')

    const unchanged = await models.Order.findByPk(order.dataValues.id)
    expect(unchanged.dataValues.TaskId).to.equal(tasks[0].dataValues.id)
  })
})
