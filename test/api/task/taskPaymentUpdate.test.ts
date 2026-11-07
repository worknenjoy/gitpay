import { expect } from 'chai'
import sinon from 'sinon'
import Models from '../../../src/models'
import { taskUpdate } from '../../../src/modules/tasks/taskUpdate'
import { taskSync } from '../../../src/modules/tasks/taskSync'
import { updateTask as updateTaskController } from '../../../src/app/controllers/task'
import PaymentMail from '../../../src/mail/payment'
import { TaskFactory, UserFactory } from '../../factories'
import { truncateModels } from '../../helpers'
const slack = require('../../../src/shared/slack')

const models = Models as any

// These integration tests use a real TEST database but never contact Stripe.
const fakeStripe = (success = true) => {
  const requests: string[] = []
  sinon.stub(globalThis, 'fetch').callsFake(async (input: any) => {
    const target = String(input)
    if (!target.startsWith('https://api.stripe.com/')) {
      throw new Error('Unexpected external network request in test: ' + target)
    }
    requests.push(target)
    if (target.includes('/charges') && !success) {
      return new Response(
        JSON.stringify({
          error: { type: 'card_error', code: 'card_declined', message: 'Card declined in test' }
        }),
        {
          status: 402,
          headers: { 'content-type': 'application/json', 'request-id': 'req_mock_declined' }
        }
      )
    }
    const value = target.includes('/charges')
      ? { id: 'ch_mock_1200', paid: true, status: 'succeeded' }
      : target.includes('/sources')
        ? { id: 'card_mock_1200' }
        : { id: 'cus_mock_1200' }
    return new Response(JSON.stringify(value), {
      status: 200,
      headers: { 'content-type': 'application/json', 'request-id': 'req_mock_success' }
    })
  })
  return requests
}

describe('issue #1200: payment update with real PostgreSQL (Stripe fully mocked)', () => {
  beforeEach(async () => {
    await truncateModels(models.Order)
    await truncateModels(models.Task)
    await truncateModels(models.User)
    sinon.stub(PaymentMail, 'success').resolves()
    sinon.stub(slack, 'notifyBounty').resolves(true)
  })

  afterEach(() => sinon.restore())

  it('persists payment, returns newly paid order and accurate value without a second client sync', async () => {
    const requests = fakeStripe()
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id, value: 0 })
    const updated = await taskUpdate({
      id: task.id,
      userId: user.id,
      Orders: {
        amount: 20,
        currency: 'usd',
        email: 'guest@test.invalid',
        source_id: 'tok_mock_1200'
      }
    })

    expect(updated.id).to.equal(task.id)
    expect(updated.Orders).to.have.length(1)
    expect(updated.Orders[0].paid).to.equal(true)
    expect(updated.Orders[0].status).to.equal('succeeded')
    expect(updated.paymentOrderId).to.equal(updated.Orders[0].id)
    expect(updated.values.available.toString()).to.equal('20')
    expect(updated.values.pending.toString()).to.equal('0')
    expect(updated.value.toString()).to.equal('20')
    expect(updated.User).to.not.have.property('password')
    expect(updated.User).to.not.have.property('customer_id')

    const persistedTask = await models.Task.findByPk(task.id, { include: [models.Order] })
    expect(persistedTask.dataValues.value.toString()).to.equal('20')
    expect(persistedTask.dataValues.Orders).to.have.length(1)
    expect(persistedTask.dataValues.Orders[0].paid).to.equal(true)
    expect(requests).to.have.length(3)
    expect(requests.filter((x) => x.includes('/charges'))).to.have.length(1)
  })

  it('does not mutate a task owned by a different user', async () => {
    const owner = await UserFactory()
    const other = await UserFactory()
    const task = await TaskFactory({ userId: owner.id, title: 'Original' })
    const unauthorized = await taskUpdate({ id: task.id, userId: other.id, title: 'Hijacked' })
    expect(unauthorized).to.be.instanceOf(Error)
    expect(unauthorized.message).to.equal('task_updated_failed')
    const persistedTask = await models.Task.findByPk(task.id)
    expect(persistedTask.title).to.equal('Original')
  })

  it('correctly persists multiple open orders in the pending bucket', async () => {
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id })
    await task.createOrder({ amount: '0.10', status: 'open', currency: 'usd' })
    await task.createOrder({ amount: '0.20', status: 'open', currency: 'usd' })
    const summary = await taskSync({ id: task.id })
    expect(summary?.value.pending.toString()).to.equal('0.3')
    expect(summary?.value.available.toString()).to.equal('0')
    const persistedTask = await models.Task.findByPk(task.id)
    expect(persistedTask.value.toString()).to.equal('0')
  })

  it('serializes StripeCardError as a 402 response that the Redux UI can display', async () => {
    fakeStripe(false)
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id, value: 0 })
    const send = sinon.spy()
    const status = sinon.stub().returns({ send })
    const response = { status, send }
    const request = {
      user: { id: user.id },
      body: {
        id: task.id,
        Orders: {
          amount: 20,
          currency: 'usd',
          email: 'guest@test.invalid',
          source_id: 'tok_mock_declined'
        }
      }
    }
    await updateTaskController(request, response)
    expect(status.firstCall.args[0]).to.equal(402)
    expect(send.firstCall.args[0]).to.deep.equal({
      type: 'StripeCardError',
      message: 'Card declined in test'
    })
  })

  it('serializes ordinary backend failures as an explicit error response', async () => {
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id })
    sinon.stub(models.Task, 'update').rejects(new Error('database update failed'))
    const send = sinon.spy()
    const status = sinon.stub().returns({ send })
    await updateTaskController(
      { user: { id: user.id }, body: { id: task.id, title: 'New' } },
      { status, send }
    )
    expect(status.firstCall.args[0]).to.equal(400)
    expect(send.firstCall.args[0]).to.deep.equal({ error: 'database update failed' })
  })

  it('rejects a Stripe card decline with no false paid order or bounty increase', async () => {
    const requests = fakeStripe(false)
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id, value: 0 })
    try {
      await taskUpdate({
        id: task.id,
        userId: user.id,
        Orders: {
          amount: 20,
          currency: 'usd',
          email: 'guest@test.invalid',
          source_id: 'tok_mock_declined'
        }
      })
      throw new Error('expected card decline')
    } catch (error: any) {
      expect(error.type).to.equal('StripeCardError')
      expect(error.message).to.contain('Card declined in test')
    }
    const persistedTask = await models.Task.findByPk(task.id, { include: [models.Order] })
    expect(persistedTask.value.toString()).to.equal('0')
    expect(persistedTask.Orders).to.have.length(1)
    expect(persistedTask.Orders[0].paid).to.equal(false)
    expect(requests.filter((x) => x.includes('/charges'))).to.have.length(1)
  })
})
