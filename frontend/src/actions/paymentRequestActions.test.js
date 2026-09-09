import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import {
  listPublicPaymentRequests,
  LIST_PUBLIC_PAYMENT_REQUESTS_REQUESTED,
  LIST_PUBLIC_PAYMENT_REQUESTS_SUCCESS,
  LIST_PUBLIC_PAYMENT_REQUESTS_ERROR
} from './paymentRequestActions'

const mockStore = configureMockStore([thunk])

describe('listPublicPaymentRequests', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('dispatches REQUESTED then SUCCESS with the fetched payment links', (done) => {
    const store = mockStore({})
    const paymentRequests = [
      { id: 1, title: 'Code review', url: 'gitpay.me/p/code-review', price: 120, paidCount: 3 }
    ]

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toContain('/payment-requests-public/user/42')
      request
        .respondWith({
          status: 200,
          response: paymentRequests
        })
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({
            type: LIST_PUBLIC_PAYMENT_REQUESTS_REQUESTED,
            completed: false
          })
          expect(actions[1]).toEqual({
            type: LIST_PUBLIC_PAYMENT_REQUESTS_SUCCESS,
            completed: true,
            paymentRequests
          })
          done()
        })
    })

    store.dispatch(listPublicPaymentRequests(42))
  })

  it('dispatches REQUESTED then ERROR when the request fails', (done) => {
    const store = mockStore({})

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({ status: 500, response: { message: 'boom' } }).then(() => {
        const actions = store.getActions()
        expect(actions[0].type).toBe(LIST_PUBLIC_PAYMENT_REQUESTS_REQUESTED)
        expect(actions[1].type).toBe(LIST_PUBLIC_PAYMENT_REQUESTS_ERROR)
        done()
      })
    })

    store.dispatch(listPublicPaymentRequests(42))
  })
})
