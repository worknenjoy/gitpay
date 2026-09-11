jest.mock('axios', () => ({}), { virtual: true })
jest.mock('../../src/consts', () => ({ API_URL: 'http://localhost:3000' }))
jest.mock('../../src/actions/notificationActions', () => ({}))

import {
  listPaymentRequestPaymentRequested,
  listPaymentRequestPaymentSucceeded,
  listPaymentRequestPaymentFailed
} from '../../src/actions/paymentRequestPaymentActions'
import { paymentRequestPayments } from '../../src/reducers/paymentRequestPaymentReducer'

describe('payment request payments loading lifecycle', () => {
  it('keeps the initial request pending until a response arrives', () => {
    const pending = paymentRequestPayments(undefined, listPaymentRequestPaymentRequested())

    expect(pending.completed).toBe(false)
    expect(pending.data).toEqual([])
    expect(pending.error).toBeNull()
  })

  it('marks a refresh pending while retaining the previously loaded rows', () => {
    const rows = [{ id: 42, status: 'paid' }]
    const loaded = paymentRequestPayments(undefined, listPaymentRequestPaymentSucceeded(rows))
    const pending = paymentRequestPayments(loaded, listPaymentRequestPaymentRequested())

    expect(pending.completed).toBe(false)
    expect(pending.data).toBe(rows)
    expect(loaded.completed).toBe(true)
  })

  it('clears a previous error when retrying and completes with new rows', () => {
    const failed = paymentRequestPayments(undefined, listPaymentRequestPaymentFailed('offline'))
    const pending = paymentRequestPayments(failed, listPaymentRequestPaymentRequested())
    const rows = [{ id: 43 }]
    const loaded = paymentRequestPayments(pending, listPaymentRequestPaymentSucceeded(rows))

    expect(pending.completed).toBe(false)
    expect(pending.error).toBeNull()
    expect(loaded).toEqual({ completed: true, error: null, data: rows })
  })

  it('only marks an empty result complete after a successful response', () => {
    const pending = paymentRequestPayments(undefined, listPaymentRequestPaymentRequested())
    const loaded = paymentRequestPayments(pending, listPaymentRequestPaymentSucceeded([]))

    expect(loaded).toEqual({ completed: true, error: null, data: [] })
  })

  it('completes a failed refresh without discarding previously loaded rows', () => {
    const rows = [{ id: 42 }]
    const loaded = paymentRequestPayments(undefined, listPaymentRequestPaymentSucceeded(rows))
    const pending = paymentRequestPayments(loaded, listPaymentRequestPaymentRequested())
    const error = new Error('Network Error')
    const failed = paymentRequestPayments(pending, listPaymentRequestPaymentFailed(error))

    expect(failed).toEqual({ completed: true, error, data: rows })
  })
})
