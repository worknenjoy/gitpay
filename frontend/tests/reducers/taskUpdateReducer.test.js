import { task } from '../../src/reducers/taskReducer'

describe('issue #1200: authoritative task update reducer', () => {
  it('returns the original state for unknown actions', () => {
    const initial = task(undefined, { type: 'UNKNOWN' })
    expect(task(initial, { type: 'UNKNOWN' })).toBe(initial)
  })

  it('tracks an update request', () => {
    expect(task(undefined, { type: 'UPDATE_TASK_REQUESTED' }).completed).toBe(false)
  })

  it('preserves legacy success action with no task payload', () => {
    const initial = task(undefined, { type: 'UNKNOWN' })
    const updated = task(initial, { type: 'UPDATE_TASK_SUCCESS' })
    expect(updated.completed).toBe(true)
    expect(updated.data).toEqual(initial.data)
    expect(updated.values).toEqual(initial.values)
  })

  it('merges changed fields and keeps GitHub metadata without a new fetch', () => {
    const state = {
      ...task(undefined, {}),
      completed: false,
      data: {
        id: 1,
        metadata: { issue: { title: 'GitHub issue' } },
        status: 'open',
        orders: [{ id: 4 }]
      },
      values: { available: 3 },
      filterOrdersBy: { paid: true }
    }
    const updated = task(state, {
      type: 'UPDATE_TASK_SUCCESS',
      data: { id: 1, status: 'in_progress', title: 'Updated' }
    })
    expect(updated.data).toEqual({
      id: 1,
      metadata: state.data.metadata,
      status: 'in_progress',
      title: 'Updated',
      orders: [{ id: 4 }]
    })
    expect(updated.values).toBe(state.values)
    expect(updated.filterOrdersBy).toEqual({})
    expect(updated.completed).toBe(true)
  })

  it('maps freshly loaded Sequelize Orders into the existing orders UI state', () => {
    const orders = [{ id: 11, paid: true, status: 'succeeded' }]
    const values = { available: 42, pending: 0, failed: 0 }
    const updated = task(undefined, {
      type: 'UPDATE_TASK_SUCCESS',
      data: { id: 8, Orders: orders, values, paid: false, value: 42 }
    })
    expect(updated.data.orders).toEqual(orders)
    expect(updated.data.Orders).toBeUndefined()
    expect(updated.data.value).toBe(42)
    expect(updated.values).toEqual(values)
  })

  it('clears old orders when server returns an empty list', () => {
    const state = { ...task(undefined, {}), data: { id: 1, orders: [{ id: 1 }] } }
    const updated = task(state, {
      type: 'UPDATE_TASK_SUCCESS',
      data: { id: 1, Orders: [] }
    })
    expect(updated.data.orders).toEqual([])
  })

  it('does not replace existing orders if server omits the association', () => {
    const state = { ...task(undefined, {}), data: { id: 1, orders: [{ id: 2 }] } }
    const updated = task(state, { type: 'UPDATE_TASK_SUCCESS', data: { id: 1, title: 'Updated' } })
    expect(updated.data.orders).toEqual([{ id: 2 }])
  })

  it('tracks failures without changing task data or bounty', () => {
    const state = {
      ...task(undefined, {}),
      data: { id: 1, title: 'Old' },
      values: { available: 3 }
    }
    const error = new Error('failed')
    const updated = task(state, { type: 'UPDATE_TASK_ERROR', error })
    expect(updated.completed).toBe(true)
    expect(updated.error).toBe(error)
    expect(updated.data).toEqual(state.data)
    expect(updated.values).toEqual(state.values)
  })
})
