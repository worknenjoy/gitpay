import { publicPaymentRequests } from './paymentRequestReducer'
import {
  LIST_PUBLIC_PAYMENT_REQUESTS_REQUESTED,
  LIST_PUBLIC_PAYMENT_REQUESTS_SUCCESS,
  LIST_PUBLIC_PAYMENT_REQUESTS_ERROR
} from '../actions/paymentRequestActions'

describe('publicPaymentRequests reducer', () => {
  it('returns the initial state', () => {
    expect(publicPaymentRequests(undefined, {})).toEqual({ data: [], completed: true, error: {} })
  })

  it('marks completed false on REQUESTED', () => {
    const state = publicPaymentRequests(
      { data: [], completed: true, error: {} },
      { type: LIST_PUBLIC_PAYMENT_REQUESTS_REQUESTED, completed: false }
    )
    expect(state.completed).toBe(false)
  })

  it('stores the fetched data on SUCCESS', () => {
    const paymentRequests = [{ id: 1, title: 'Code review', price: 120, paidCount: 3 }]
    const state = publicPaymentRequests(
      { data: [], completed: false, error: {} },
      { type: LIST_PUBLIC_PAYMENT_REQUESTS_SUCCESS, completed: true, paymentRequests }
    )
    expect(state).toEqual({ data: paymentRequests, completed: true, error: {} })
  })

  it('stores the error on ERROR', () => {
    const error = new Error('boom')
    const state = publicPaymentRequests(
      { data: [], completed: false, error: {} },
      { type: LIST_PUBLIC_PAYMENT_REQUESTS_ERROR, completed: true, error }
    )
    expect(state).toEqual({ data: [], completed: true, error })
  })
})
