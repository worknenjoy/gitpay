import { expect } from 'chai'
import request from 'supertest'
import nock from 'nock'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { TaskFactory, AssignFactory, OrderFactory } from '../../factories'
import { updated as transferUpdated } from '../../data/stripe/stripe.transfer.updated'

const agent = request.agent(api)
const models = Models as any
const transfer = transferUpdated.data.object

const setupFundedTask = async () => {
  const owner = await registerAndLogin(agent)
  const task = await TaskFactory({
    userId: owner.body.id,
    value: 200,
    status: 'closed'
  })
  const claimer = await registerAndLogin(agent, { account_id: 'acct_1Gqj2tGjYvP2Yx5R' })
  const assign = await AssignFactory(
    { TaskId: task.id, userId: claimer.body.id },
    { include: [models.User] }
  )
  await models.Task.update({ assigned: assign.id }, { where: { id: task.id } })
  await OrderFactory({
    userId: owner.body.id,
    TaskId: task.id,
    amount: 200,
    paid: true,
    provider: 'stripe'
  })
  return { owner, task }
}

describe('POST /tasks/payments', () => {
  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)
    await truncateModels(models.Transfer)
    await truncateModels(models.Coupon)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('rejects a non-owner before creating a Stripe transfer', async () => {
    const { task } = await setupFundedTask()
    const attacker = await registerAndLogin(agent)

    const res = await agent
      .post('/tasks/payments')
      .set('authorization', attacker.headers.authorization)
      .send({ taskId: task.id, value: 1000 })
      .expect(403)

    expect(res.body).to.deep.equal({ error: 'not_authorized' })
    const unchangedTask = await models.Task.findByPk(task.id)
    expect(unchangedTask.transfer_id).to.equal(null)
  })

  it('rejects a payment larger than captured funds', async () => {
    const { owner, task } = await setupFundedTask()

    const res = await agent
      .post('/tasks/payments')
      .set('authorization', owner.headers.authorization)
      .send({ taskId: task.id, value: 1000 })
      .expect(403)

    expect(res.body).to.deep.equal({ error: 'amount_exceeds_funding' })
  })

  it('creates a single idempotent owner payment using captured funds', async () => {
    const { owner, task } = await setupFundedTask()

    nock('https://api.stripe.com')
      .post('/v1/transfers')
      .matchHeader('Idempotency-Key', `task-payment-${task.id}`)
      .reply(200, transfer)

    const res = await agent
      .post('/tasks/payments')
      .set('authorization', owner.headers.authorization)
      .send({ taskId: task.id })
      .expect(200)

    expect(res.body.id).to.equal(transfer.id)
    const paidTask = await models.Task.findByPk(task.id)
    expect(paidTask.transfer_id).to.equal(transfer.id)
  })
})
