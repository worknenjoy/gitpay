import { expect } from 'chai'
import sinon from 'sinon'
import models from '../../src/models'
import { taskUpdate } from '../../src/modules/tasks/taskUpdate'
import PaymentMail from '../../src/mail/payment'
import DeadlineMail from '../../src/mail/deadline'
import AssignMail from '../../src/mail/assign'
import i18n from 'i18n'
const slack = require('../../src/shared/slack')

const m = models as any
const owner = { dataValues: { id: 9, name: 'Owner', email: 'owner@test.invalid' } }
const successfulOrder = {
  id: 55,
  paid: true,
  amount: '20.00',
  currency: 'usd',
  status: 'succeeded',
  provider: 'stripe'
}

const initialTask = () => ({
  dataValues: { id: 1, User: owner, assigned: null },
  Assigns: [],
  createOrder: sinon.stub(),
  createMember: sinon.stub(),
  createAssign: sinon.stub(),
  createOffer: sinon.stub(),
  update: sinon.stub().resolves({})
})
const finalTask = (overrides: any = {}) => ({
  toJSON: () => ({ id: 1, title: 'Authoritative', status: 'open', Orders: [], ...overrides })
})

const setupStandardUpdate = (initial: any = initialTask(), final: any = finalTask()) => {
  const update = sinon.stub(m.Task, 'update').resolves([1])
  const find = sinon.stub(m.Task, 'findByPk')
  find.onCall(0).resolves(initial)
  find.onCall(1).resolves(final)
  return { update, find, initial }
}

const mockStripeFetch = (paid = true) => {
  const calls: Array<{ url: string; request: any }> = []
  const mock = sinon.stub(globalThis, 'fetch').callsFake(async (url: any, request: any) => {
    const target = String(url)
    calls.push({ url: target, request })
    const body = target.includes('/charges')
      ? { id: 'ch_test_mock', paid, status: paid ? 'succeeded' : 'failed' }
      : target.includes('/sources')
        ? { id: 'card_test_mock' }
        : { id: 'cus_test_mock' }
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json', 'request-id': 'req_local_1200' }
    })
  })
  return { mock, calls }
}

const setupGuestPayment = (paid = true) => {
  const initial = initialTask()
  const order = {
    id: 55,
    dataValues: { id: 55 },
    amount: 20,
    currency: 'usd',
    userId: null,
    update: sinon.stub().resolves({})
  }
  initial.createOrder.resolves(order)
  const update = sinon.stub(m.Task, 'update').resolves([1])
  const find = sinon.stub(m.Task, 'findByPk')
  find.onCall(0).resolves(initial)
  if (paid) {
    const save = sinon.stub().resolves({})
    const set = sinon.stub().returns({ save })
    find.onCall(1).resolves({
      dataValues: { Orders: [successfulOrder] },
      transfer_id: null,
      set
    })
    find.onCall(2).resolves(finalTask({ Orders: [successfulOrder], value: '20.00' }))
  }
  const orderUpdate = sinon.stub(m.Order, 'update').resolves([1])
  const calculate = sinon.stub(m.Plan, 'calcFinalPrice').returns(20)
  sinon.stub(PaymentMail, 'success').resolves()
  sinon.stub(slack, 'notifyBounty').resolves(true)
  const stripe = mockStripeFetch(paid)
  return { initial, order, update, find, orderUpdate, calculate, stripe }
}

describe('issue #1200: backend taskUpdate service (isolated database/Stripe)', () => {
  afterEach(() => sinon.restore())

  it('does not return private task data after an unauthorized/zero-row update', async () => {
    const update = sinon.stub(m.Task, 'update').resolves([0])
    const owned = sinon.stub(m.Task, 'findOne').resolves(null)
    const find = sinon.stub(m.Task, 'findByPk')
    const result = await taskUpdate({ id: 1, userId: 55, title: 'Hijack' })
    expect(result).to.be.instanceOf(Error)
    expect((result as Error).message).to.equal('task_updated_failed')
    expect(find.called).to.equal(false)
    expect(owned.firstCall.args[0].where).to.deep.equal({ id: 1, userId: 55 })
    expect(update.firstCall.args[1].where).to.deep.equal({ id: 1, userId: 55 })
  })

  it('does not return task data for missing update results', async () => {
    sinon.stub(m.Task, 'update').resolves(null)
    sinon.stub(m.Task, 'findOne').resolves(null)
    const find = sinon.stub(m.Task, 'findByPk')
    const result = await taskUpdate({ id: 1, userId: 9 })
    expect(result).to.be.instanceOf(Error)
    expect(find.called).to.equal(false)
  })

  it('returns a defined error if the task cannot be found after updating', async () => {
    sinon.stub(m.Task, 'update').resolves([1])
    sinon.stub(m.Task, 'findByPk').resolves(null)
    const result = await taskUpdate({ id: 1, userId: 9 })
    expect((result as Error).message).to.equal('task_find_failed')
  })

  it('returns fresh task fields and requests exclusion of sensitive nested user attributes', async () => {
    const { find } = setupStandardUpdate()
    const result = await taskUpdate({ id: 1, userId: 9, title: 'New title' })
    expect(result.title).to.equal('Authoritative')
    expect(find.calledTwice).to.equal(true)
    const includes = find.secondCall.args[1].include
    expect(includes[0].attributes.exclude).to.include('password')
    expect(includes[0].attributes.exclude).to.include('customer_id')
    expect(includes[1].include[0].attributes.exclude).to.include('github_access_token')
  })

  it('throws if reloading an updated task fails rather than sending stale data', async () => {
    const { find } = setupStandardUpdate()
    find.onCall(1).resolves(null)
    try {
      await taskUpdate({ id: 1, userId: 9 })
      throw new Error('expected reload to fail')
    } catch (error: any) {
      expect(error.message).to.equal('task_find_failed')
    }
  })

  it('sends a deadline message and still returns the fresh task', async () => {
    const initial = initialTask()
    initial.dataValues.assigned = 33
    setupStandardUpdate(initial)
    const findAssigned = sinon.stub(m.Assign, 'findOne').resolves({
      User: { dataValues: { email: 'assigned@test.invalid', username: 'Assigned' } }
    })
    const mail = sinon.stub(DeadlineMail, 'update')
    const result = await taskUpdate({ id: 1, userId: 9, deadline: '2026-12-01' })
    expect(result.title).to.equal('Authoritative')
    expect(findAssigned.calledOnce).to.equal(true)
    expect(mail.calledOnce).to.equal(true)
  })

  it('updates assignment state and sends notifications only when requested', async () => {
    const initial = initialTask()
    initial.Assigns = [{ userId: 12 }, { userId: 8 }]
    setupStandardUpdate(initial)
    sinon.stub(m.Assign, 'findOne').resolves({
      User: { dataValues: { id: 12, email: 'assigned@test.invalid' } }
    })
    const ownerMail = sinon.stub(AssignMail.owner, 'assigned')
    const assignedMail = sinon.stub(AssignMail, 'assigned')
    const result = await taskUpdate({ id: 1, userId: 9, assigned: 33 }, false)
    expect(result.id).to.equal(1)
    expect(initial.update.firstCall.args[0]).to.deep.equal({ status: 'in_progress' })
    expect(ownerMail.called).to.equal(false)
    expect(assignedMail.called).to.equal(false)
  })

  it('handles successful guest card payment with a newly created order and updated bounty', async () => {
    const env = setupGuestPayment()
    const result = await taskUpdate({
      id: 1,
      userId: 9,
      Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
    })
    expect(result.Orders).to.deep.equal([successfulOrder])
    expect(result.paymentOrderId).to.equal(55)
    expect(result.values.available.toString()).to.equal('20')
    expect(result.value).to.equal('20.00')
    expect(env.orderUpdate.calledOnce).to.equal(true)
    expect(env.find.callCount).to.equal(3)
    expect(env.stripe.calls.map((x) => x.url).some((x) => x.includes('/charges'))).to.equal(true)
    expect(env.stripe.calls.some((x) => x.url.includes('/customers'))).to.equal(true)
  })

  it('rejects an unsuccessful card charge without reporting payment success or syncing', async () => {
    const env = setupGuestPayment(false)
    try {
      await taskUpdate({
        id: 1,
        userId: 9,
        Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
      })
      throw new Error('expected charge to fail')
    } catch (error: any) {
      expect(error.message).to.equal('charge_not_succeeded')
    }
    expect(env.orderUpdate.called).to.equal(false)
    expect(env.find.calledOnce).to.equal(true)
  })
  it('reuses an existing Stripe customer for a registered buyer', async () => {
    const env = setupGuestPayment()
    env.order.userId = 44
    const findUser = sinon.stub().resolves({
      customer_id: 'cus_existing',
      dataValues: { customer_id: 'cus_existing', email: 'buyer@test.invalid' }
    })
    const scope = sinon.stub(m.User, 'scope').returns({ findByPk: findUser })
    const response = await taskUpdate({
      id: 1,
      userId: 9,
      Orders: { amount: 20, currency: 'usd', source_id: 'tok_test' }
    })
    expect(response.values.available.toString()).to.equal('20')
    expect(scope.calledWith('withSensitive')).to.equal(true)
    expect(env.stripe.calls.some((x) => x.url.includes('/customers/cus_existing'))).to.equal(true)
    expect(env.stripe.calls.filter((x) => x.url.endsWith('/customers')).length).to.equal(0)
  })

  it('creates and saves a new Stripe customer for a registered buyer', async () => {
    const env = setupGuestPayment()
    env.order.userId = 44
    sinon.stub(m.User, 'scope').returns({
      findByPk: sinon.stub().resolves({
        customer_id: null,
        dataValues: { customer_id: null, email: 'buyer@test.invalid' }
      })
    })
    const updateUser = sinon.stub(m.User, 'update').resolves([1])
    const response = await taskUpdate({
      id: 1,
      userId: 9,
      Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
    })
    expect(response.id).to.equal(1)
    expect(updateUser.calledOnce).to.equal(true)
    expect(updateUser.firstCall.args[1].where).to.deep.equal({ id: 44 })
  })

  it('rejects payment for a nonexistent linked user', async () => {
    const env = setupGuestPayment()
    env.order.userId = 44
    sinon.stub(m.User, 'scope').returns({ findByPk: sinon.stub().resolves(null) })
    try {
      await taskUpdate({ id: 1, userId: 9, Orders: { amount: 20 } })
      throw new Error('payment should have failed')
    } catch (error: any) {
      expect(error.message).to.equal('payment_user_not_found')
    }
    expect(env.stripe.calls.length).to.equal(0)
  })

  it('does not charge if creating a linked customer fails to update the user', async () => {
    const env = setupGuestPayment()
    env.order.userId = 44
    sinon.stub(m.User, 'scope').returns({
      findByPk: sinon.stub().resolves({
        customer_id: null,
        dataValues: { customer_id: null, email: 'buyer@test.invalid' }
      })
    })
    sinon.stub(m.User, 'update').resolves([0])
    try {
      await taskUpdate({
        id: 1,
        userId: 9,
        Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
      })
      throw new Error('should not charge')
    } catch (error: any) {
      expect(error.message).to.equal('user not updated')
    }
    expect(env.stripe.calls.some((x) => x.url.includes('/charges'))).to.equal(false)
  })

  it('handles a 100%-discount coupon without a Stripe charge', async () => {
    const env = setupGuestPayment()
    sinon.stub(m.Coupon, 'findOne').resolves({
      dataValues: { id: 4, code: 'FREE', times: 2, amount: 100, validUntil: new Date('2999-01-01') }
    })
    const updateCoupon = sinon.stub(m.Coupon, 'update').resolves([1])
    const response = await taskUpdate({
      id: 1,
      userId: 9,
      coupon: { code: 'FREE', originalOrderPrice: 20 },
      Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
    })
    expect(response.values.available.toString()).to.equal('20')
    expect(env.stripe.calls.some((x) => x.url.includes('/charges'))).to.equal(false)
    expect(updateCoupon.calledOnce).to.equal(true)
    expect(env.order.update.calledOnce).to.equal(true)
    expect(env.order.update.firstCall.args[0]).to.deep.equal({ couponId: 4 })
    expect(env.orderUpdate.calledOnce).to.equal(true)
  })

  it('rejects an expired coupon before charging and before a success response', async () => {
    const env = setupGuestPayment()
    sinon.stub(m.Coupon, 'findOne').resolves({
      dataValues: {
        id: 4,
        code: 'EXPIRED',
        times: 2,
        amount: 50,
        validUntil: new Date('2020-01-01')
      }
    })
    const couponUpdate = sinon.stub(m.Coupon, 'update')
    try {
      await taskUpdate({
        id: 1,
        userId: 9,
        coupon: { code: 'EXPIRED', originalOrderPrice: 20 },
        Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
      })
      throw new Error('expected coupon failure')
    } catch (error: any) {
      expect(error.message).to.equal('coupon_processing_failed')
    }
    expect(env.stripe.calls.some((x) => x.url.includes('/charges'))).to.equal(false)
    expect(couponUpdate.called).to.equal(false)
    expect(env.orderUpdate.called).to.equal(false)
  })

  it('applies a partial discount to charge amount calculation', async () => {
    const env = setupGuestPayment()
    sinon.stub(m.Coupon, 'findOne').resolves({
      dataValues: { id: 4, code: 'HALF', times: 2, amount: 50, validUntil: new Date('2999-01-01') }
    })
    sinon.stub(m.Coupon, 'update').resolves([1])
    await taskUpdate({
      id: 1,
      userId: 9,
      coupon: { code: 'HALF', originalOrderPrice: 20 },
      Orders: { amount: 20, currency: 'usd', email: 'buyer@test.invalid', source_id: 'tok_test' }
    })
    expect(env.calculate.firstCall.args[0]).to.equal(10)
    expect(env.order.update.firstCall.args[0]).to.deep.equal({ couponId: 4 })
  })

  it('creates an offer with a related assignment and sends interest mail', async () => {
    const initial = initialTask()
    setupStandardUpdate(initial)
    sinon.stub(i18n, 'setLocale')
    const createAssign = initial.createAssign.resolves({ id: 7 })
    const createOffer = initial.createOffer.resolves({ id: 20 })
    sinon.stub(m.Assign, 'findOne').resolves(null)
    sinon.stub(m.Offer, 'findOne').resolves(null)
    sinon.stub(m.User, 'findOne').resolves({
      dataValues: { id: 5, email: 'candidate@test.invalid' },
      language: 'en'
    })
    const send = sinon.stub(AssignMail, 'interested')
    const ownerSend = sinon.stub(AssignMail.owner, 'interested')
    const response = await taskUpdate({ id: 1, userId: 9, Offer: { userId: 5, taskId: 1 } })
    expect(response.id).to.equal(1)
    expect(createAssign.calledOnce).to.equal(true)
    expect(createOffer.calledOnce).to.equal(true)
    expect(send.calledOnce).to.equal(true)
    expect(ownerSend.calledOnce).to.equal(true)
  })

  it('sends the missing-email notice when an interested user has no email', async () => {
    setupStandardUpdate()
    sinon.stub(i18n, 'setLocale')
    sinon.stub(m.Assign, 'findOne').resolves({ id: 7 })
    sinon.stub(m.Offer, 'findOne').resolves({ id: 20 })
    sinon.stub(m.Offer, 'update').resolves([1])
    sinon.stub(m.User, 'findOne').resolves({
      dataValues: { id: 5, email: null },
      language: 'en'
    })
    const errorMail = sinon.stub(AssignMail, 'error')
    sinon.stub(AssignMail, 'interested')
    sinon.stub(AssignMail.owner, 'interested')
    const response = await taskUpdate({
      id: 1,
      userId: 9,
      Offer: { userId: 5, taskId: 1 }
    })
    expect(response.id).to.equal(1)
    expect(errorMail.calledOnce).to.equal(true)
  })

  it('updates an existing offer instead of duplicating it', async () => {
    setupStandardUpdate()
    sinon.stub(i18n, 'setLocale')
    sinon.stub(m.Assign, 'findOne').resolves({ id: 7 })
    sinon.stub(m.Offer, 'findOne').resolves({ id: 20 })
    const updateOffer = sinon.stub(m.Offer, 'update').resolves([1])
    sinon.stub(m.User, 'findOne').resolves({
      dataValues: { id: 5, email: 'candidate@test.invalid' },
      language: 'en'
    })
    sinon.stub(AssignMail, 'interested')
    sinon.stub(AssignMail.owner, 'interested')
    const response = await taskUpdate({ id: 1, userId: 9, Offer: { userId: 5, taskId: 1 } })
    expect(response.id).to.equal(1)
    expect(updateOffer.calledOnce).to.equal(true)
  })

  it('creates new member association then reloads the latest state', async () => {
    const initial = initialTask()
    setupStandardUpdate(initial)
    sinon.stub(m.Member, 'findOne').resolves(null)
    initial.createMember.resolves({ id: 11 })
    const response = await taskUpdate({ id: 1, userId: 9, Members: [{ userId: 5 }] })
    expect(response.id).to.equal(1)
    expect(initial.createMember.calledOnce).to.equal(true)
  })

  it('updates existing member instead of creating a duplicate', async () => {
    const initial = initialTask()
    setupStandardUpdate(initial)
    sinon.stub(m.Member, 'findOne').resolves({ id: 11 })
    const updateMember = sinon.stub(m.Member, 'update').resolves([1])
    const response = await taskUpdate({ id: 1, userId: 9, Members: [{ userId: 5 }] })
    expect(response.id).to.equal(1)
    expect(updateMember.calledOnce).to.equal(true)
    expect(initial.createMember.called).to.equal(false)
  })

  it('returns authoritative state if creating a member fails', async () => {
    const initial = initialTask()
    setupStandardUpdate(initial)
    sinon.stub(m.Member, 'findOne').resolves(null)
    initial.createMember.rejects(new Error('Already exists'))
    const response = await taskUpdate({ id: 1, userId: 9, Members: [{ userId: 5 }] })
    expect(response.id).to.equal(1)
  })

  it('notifies both task owner and assignee on assignment when enabled', async () => {
    const initial = initialTask()
    initial.Assigns = [{ userId: 12 }, { userId: 8 }]
    setupStandardUpdate(initial)
    sinon.stub(m.Assign, 'findOne').resolves({
      User: { dataValues: { id: 12, email: 'assigned@test.invalid' } }
    })
    const ownerMail = sinon.stub(AssignMail.owner, 'assigned')
    const assignedMail = sinon.stub(AssignMail, 'assigned')
    await taskUpdate({ id: 1, userId: 9, assigned: 33 })
    expect(ownerMail.calledOnce).to.equal(true)
    expect(assignedMail.calledOnce).to.equal(true)
  })
})
