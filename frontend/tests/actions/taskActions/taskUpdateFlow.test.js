/** @jest-environment jsdom */
import axios from 'axios'
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import { updateTask } from '../../../src/actions/taskActions'

jest.mock('axios')
const makeStore = configureMockStore([thunk])
const makeState = () => ({
  intl: { messages: {} },
  task: { completed: true, data: { id: 1, orders: [] } },
  loggedIn: { logged: true, data: { id: 1 } }
})
const types = (store) => store.getActions().map((action) => action.type)
const notifications = (store) =>
  store.getActions().filter((action) => action.type === 'ADD_NOTIFICATION')

describe('issue #1200: task update without redundant fetch/sync requests', () => {
  beforeEach(() => axios.put.mockReset())

  it('updates from a single API response and preserves the complete returned task', async () => {
    const updated = { id: 1, title: 'Updated', status: 'in_progress', values: { available: 10 } }
    axios.put.mockResolvedValue({ data: updated })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, title: 'Updated' }))
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/tasks/update'), {
      id: 1,
      title: 'Updated'
    })
    expect(types(store)).toEqual([
      'UPDATE_TASK_REQUESTED',
      'ADD_NOTIFICATION',
      'UPDATE_TASK_SUCCESS'
    ])
    expect(notifications(store)[0].text).toBe('actions.task.update.notification.success')
    expect(store.getActions()[2].data).toEqual(updated)
  })

  it('notifies confirmed successful Stripe payment and returns orders and bounty', async () => {
    const updated = {
      id: 1,
      paymentOrderId: 70,
      Orders: [{ id: 70, paid: true, status: 'succeeded', amount: '20.00' }],
      values: { available: '20.00', pending: 0, failed: 0 }
    }
    axios.put.mockResolvedValue({ data: updated })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Orders: { amount: 20, source_id: 'tok_test' } }))
    expect(types(store)).toEqual([
      'UPDATE_TASK_REQUESTED',
      'ADD_NOTIFICATION',
      'UPDATE_TASK_SUCCESS'
    ])
    expect(notifications(store)[0].text).toBe('actions.task.payment.notification.success')
    expect(store.getActions()[2].data).toEqual(updated)
    expect(axios.put).toHaveBeenCalledTimes(1)
  })

  it('does not mistake an older paid order for the new failed payment', async () => {
    axios.put.mockResolvedValue({
      data: {
        id: 1,
        paymentOrderId: 71,
        Orders: [
          { id: 70, paid: true, status: 'succeeded' },
          { id: 71, paid: false, status: 'failed' }
        ]
      }
    })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Orders: { amount: 20 } }))
    expect(types(store)).toEqual(['UPDATE_TASK_REQUESTED', 'ADD_NOTIFICATION', 'UPDATE_TASK_ERROR'])
    expect(notifications(store)[0].severity).toBe('error')
  })

  it('rejects a payment response without a confirmed successful order', async () => {
    axios.put.mockResolvedValue({
      data: { id: 1, Orders: [{ id: 70, paid: false, status: 'failed' }] }
    })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Orders: { amount: 20 } }))
    expect(types(store)).toEqual(['UPDATE_TASK_REQUESTED', 'ADD_NOTIFICATION', 'UPDATE_TASK_ERROR'])
    expect(notifications(store)[0].severity).toBe('error')
  })

  it('rejects a payment response without orders', async () => {
    axios.put.mockResolvedValue({ data: { id: 1 } })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Orders: { amount: 20 } }))
    expect(types(store)).toEqual(['UPDATE_TASK_REQUESTED', 'ADD_NOTIFICATION', 'UPDATE_TASK_ERROR'])
  })

  it('uses the interested notification for offers', async () => {
    axios.put.mockResolvedValue({ data: { id: 1, Offers: [{ id: 12 }] } })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Offer: { userId: 5 } }))
    expect(notifications(store)[0].text).toBe('actions.task.interested.notification.success')
    expect(types(store)[2]).toBe('UPDATE_TASK_SUCCESS')
  })

  it.each([null, {}, { error: 'update failed' }])(
    'rejects an invalid successful response: %p',
    async (data) => {
      axios.put.mockResolvedValue({ data })
      const store = makeStore(makeState())
      await store.dispatch(updateTask({ id: 1 }))
      expect(types(store)).toEqual([
        'UPDATE_TASK_REQUESTED',
        'ADD_NOTIFICATION',
        'UPDATE_TASK_ERROR'
      ])
    }
  )

  it('preserves Stripe card-decline detail and returns to the payment tab', async () => {
    const error = { type: 'StripeCardError', message: 'Card declined' }
    axios.put.mockRejectedValue({ response: { status: 400, data: error } })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1, Orders: { amount: 20 } }))
    expect(types(store)).toEqual([
      'UPDATE_TASK_REQUESTED',
      'ADD_NOTIFICATION',
      'CHANGE_TASK_TAB',
      'UPDATE_TASK_ERROR'
    ])
    expect(notifications(store)[0].text).toBe('actions.task.payment.notification.error')
    expect(store.getActions()[3].error).toEqual(error)
  })

  it('dispatches a rate-limit error without fetching stale task data', async () => {
    axios.put.mockRejectedValue({
      response: { status: 403, data: { error: 'API rate limit exceeded' } }
    })
    const store = makeStore(makeState())
    await store.dispatch(updateTask({ id: 1 }))
    expect(types(store)).toEqual(['UPDATE_TASK_REQUESTED', 'ADD_NOTIFICATION', 'UPDATE_TASK_ERROR'])
    expect(notifications(store)[0].severity).toBe('error')
  })

  it.each([new Error('Network Error'), { response: { status: 500, data: null } }])(
    'dispatches update error for %p',
    async (error) => {
      axios.put.mockRejectedValue(error)
      const store = makeStore(makeState())
      await store.dispatch(updateTask({ id: 1 }))
      expect(types(store)).toEqual([
        'UPDATE_TASK_REQUESTED',
        'ADD_NOTIFICATION',
        'UPDATE_TASK_ERROR'
      ])
      expect(store.getActions()[2].error).toBe(error)
      expect(axios.put).toHaveBeenCalledTimes(1)
    }
  )
})
