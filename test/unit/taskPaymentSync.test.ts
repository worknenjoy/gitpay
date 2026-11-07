import { expect } from 'chai'
import sinon from 'sinon'
import models from '../../src/models'
import { taskSync } from '../../src/modules/tasks/taskSync'
import { summarizeTaskOrders } from '../../src/modules/tasks/taskOrderSummary'

const amount = (summary: any, field: string) => summary[field].toString()
const zero = () => ({
  available: '0',
  pending: '0',
  failed: '0',
  card: '0',
  paypal: '0',
  transferred: '0'
})
const plain = (summary: any) =>
  Object.fromEntries(Object.keys(zero()).map((key) => [key, amount(summary, key)]))

describe('issue #1200: task payment totals (isolated, no Stripe requests)', () => {
  afterEach(() => sinon.restore())

  it('starts every bucket at zero for an unfunded task', () => {
    expect(plain(summarizeTaskOrders([]))).to.deep.equal(zero())
  })

  it('sums multiple open orders with exact decimal precision', () => {
    const summary = summarizeTaskOrders([
      { amount: '0.1', status: 'open' },
      { amount: '0.2', status: 'open' },
      { amount: '35.55', status: 'open' }
    ])
    expect(amount(summary, 'pending')).to.equal('35.85')
    expect(amount(summary, 'available')).to.equal('0')
  })

  it('adds paid card transactions to available and card buckets', () => {
    const summary = summarizeTaskOrders([
      { amount: '12.50', status: 'succeeded', paid: true, provider: 'stripe' },
      { amount: '2.50', status: 'succeeded', paid: true }
    ])
    expect(amount(summary, 'available')).to.equal('15')
    expect(amount(summary, 'card')).to.equal('15')
  })

  it('keeps paid PayPal funding separate from card funding', () => {
    const summary = summarizeTaskOrders([
      { amount: 11, paid: true, status: 'succeeded', provider: 'paypal' },
      { amount: 4, paid: true, status: 'succeeded', provider: 'stripe' }
    ])
    expect(amount(summary, 'available')).to.equal('15')
    expect(amount(summary, 'paypal')).to.equal('11')
    expect(amount(summary, 'card')).to.equal('4')
  })

  it('tracks transferred paid funds only', () => {
    const summary = summarizeTaskOrders([
      { amount: 3, paid: true, status: 'succeeded', transfer_id: 'tr_1' },
      { amount: 2, paid: true, status: 'succeeded' },
      { amount: 99, paid: false, status: 'failed', transfer_id: 'tr_2' }
    ])
    expect(amount(summary, 'transferred')).to.equal('3')
    expect(amount(summary, 'failed')).to.equal('99')
    expect(amount(summary, 'available')).to.equal('5')
  })

  it('counts unsuccessful non-open orders as failed, not as funding', () => {
    const summary = summarizeTaskOrders([
      { amount: 8, paid: false, status: 'failed' },
      { amount: 6, paid: false, status: 'canceled' }
    ])
    expect(amount(summary, 'failed')).to.equal('14')
    expect(amount(summary, 'available')).to.equal('0')
  })

  it('treats an open order as pending even if it has an inconsistent paid flag', () => {
    const summary = summarizeTaskOrders([{ amount: 7, status: 'open', paid: true }])
    expect(amount(summary, 'pending')).to.equal('7')
    expect(amount(summary, 'available')).to.equal('0')
  })

  it('handles a full-discount coupon without inventing new funds', () => {
    const summary = summarizeTaskOrders([{ amount: 0, status: 'succeeded', paid: true }])
    expect(amount(summary, 'available')).to.equal('0')
  })

  it('aggregates mixed providers, open orders, transfers and failures without precision drift', () => {
    const summary = summarizeTaskOrders([
      { amount: '0.10', status: 'succeeded', paid: true, provider: 'stripe' },
      { amount: '0.20', status: 'succeeded', paid: true, provider: 'paypal', transfer_id: 'p_1' },
      { amount: '0.30', status: 'open' },
      { amount: '0.40', status: 'failed', paid: false }
    ])
    expect(plain(summary)).to.deep.equal({
      available: '0.3',
      pending: '0.3',
      failed: '0.4',
      card: '0.1',
      paypal: '0.2',
      transferred: '0.2'
    })
  })

  it('rejects invalid amounts rather than silently showing a wrong balance', () => {
    expect(() =>
      summarizeTaskOrders([{ amount: 'not-a-number', status: 'succeeded', paid: true }])
    ).to.throw()
  })
})

describe('issue #1200: taskSync persists authoritative payment totals', () => {
  afterEach(() => sinon.restore())

  it('returns not-found error without updating anything', async () => {
    sinon.stub((models as any).Task, 'findByPk').resolves(null)
    try {
      await taskSync({ id: 42 })
      throw new Error('expected not-found error')
    } catch (error: any) {
      expect(error.message).to.equal('Task not found')
    }
  })

  it('persists available/pending, keeps task open before payout, returns every total', async () => {
    const save = sinon.stub().resolves({})
    const set = sinon.stub().returns({ save })
    const stub = sinon.stub((models as any).Task, 'findByPk').resolves({
      dataValues: {
        Orders: [
          { amount: '4.30', paid: true, provider: 'stripe', status: 'succeeded' },
          { amount: '1.20', status: 'open' }
        ]
      },
      transfer_id: null,
      set
    } as any)
    const response = await taskSync({ id: 7 })
    expect(stub.calledOnce).to.equal(true)
    expect(amount(response?.value, 'available')).to.equal('4.3')
    expect(amount(response?.value, 'pending')).to.equal('1.2')
    expect(set.firstCall.args[0].paid).to.equal(false)
    expect(set.firstCall.args[0].status).to.equal(undefined)
    expect(set.firstCall.args[0].value.toString()).to.equal('4.3')
    expect(save.calledOnce).to.equal(true)
  })

  it('closes fully paid/transferred tasks after the payout is reconciled', async () => {
    const save = sinon.stub().resolves({})
    const set = sinon.stub().returns({ save })
    sinon.stub((models as any).Task, 'findByPk').resolves({
      dataValues: {
        Orders: [
          { amount: 8, paid: true, status: 'succeeded', provider: 'paypal', transfer_id: 'tr_1' }
        ]
      },
      transfer_id: 'tr_task',
      set
    } as any)
    await taskSync({ id: 8 })
    expect(set.firstCall.args[0].paid).to.equal(true)
    expect(set.firstCall.args[0].status).to.equal('closed')
  })

  it('keeps a task open if PayPal funding was not transferred even if a Stripe transfer exists', async () => {
    const save = sinon.stub().resolves({})
    const set = sinon.stub().returns({ save })
    sinon.stub((models as any).Task, 'findByPk').resolves({
      dataValues: {
        Orders: [{ amount: 8, paid: true, status: 'succeeded', provider: 'paypal' }]
      },
      transfer_id: 'tr_task',
      set
    } as any)
    await taskSync({ id: 11 })
    expect(set.firstCall.args[0].paid).to.equal(false)
    expect(set.firstCall.args[0].status).to.equal(undefined)
  })

  it('returns undefined if saving the reconciled task fails without throwing', async () => {
    const save = sinon.stub().resolves(null)
    const set = sinon.stub().returns({ save })
    sinon.stub((models as any).Task, 'findByPk').resolves({
      dataValues: { Orders: [] },
      transfer_id: null,
      set
    } as any)
    expect(await taskSync({ id: 10 })).to.equal(undefined)
  })
})
