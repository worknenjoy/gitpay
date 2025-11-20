/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as paymentRequestPaymentActions from '../../src/actions/paymentRequestPaymentActions'
import * as types from '../../src/actions/paymentRequestPaymentActions'
import api from '../../src/consts'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares as any[])

describe('paymentRequestPayment actions', () => {
  describe('action creators', () => {
    it('should create paymentRequestPayment action objects', () => {
      // requested without payload
      expect(paymentRequestPaymentActions.listPaymentRequestPaymentRequested()).to.eql({
        type: types.LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
        payload: undefined,
      })

      // requested with payload
      const reqPayload = { page: 1 }
      expect(paymentRequestPaymentActions.listPaymentRequestPaymentRequested(reqPayload)).to.eql({
        type: types.LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
        payload: reqPayload,
      })

      // succeeded
      const successPayload = [{ id: 1 }]
      expect(
        paymentRequestPaymentActions.listPaymentRequestPaymentSucceeded(successPayload),
      ).to.eql({
        type: types.LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
        payload: successPayload,
      })

      // failed
      const errorPayload = { error: true }
      expect(paymentRequestPaymentActions.listPaymentRequestPaymentFailed(errorPayload)).to.eql({
        type: types.LIST_PAYMENT_REQUEST_PAYMENT_FAILED,
        payload: errorPayload,
      })
    })
  })

  describe('async actions', () => {
    beforeEach(() => {
      moxios.install()
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('creates LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED when listing payments succeeds', () => {
      const paymentsData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/payment-request-payments`, {
        status: 200,
        response: paymentsData,
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED, payload: undefined },
        { type: types.LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED, payload: paymentsData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestPaymentActions.listPaymentRequestPayments())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })

    it('creates LIST_PAYMENT_REQUEST_PAYMENT_FAILED when API returns error in body', () => {
      const apiError = 'Something went wrong'
      moxios.stubRequest(`${api.API_URL}/payment-request-payments`, {
        status: 200,
        response: { error: apiError },
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED, payload: undefined },
        { type: types.LIST_PAYMENT_REQUEST_PAYMENT_FAILED, payload: apiError },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestPaymentActions.listPaymentRequestPayments())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })

    it('creates LIST_PAYMENT_REQUEST_PAYMENT_FAILED when listing payments fails (HTTP 500)', () => {
      moxios.stubRequest(`${api.API_URL}/payment-request-payments`, {
        status: 500,
      })

      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestPaymentActions.listPaymentRequestPayments())
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).to.eql({
            type: types.LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
            payload: undefined,
          })
          expect(actions[1].type).to.equal(types.LIST_PAYMENT_REQUEST_PAYMENT_FAILED)
          expect(actions[1].payload).to.be.an('error')
          expect(actions[1].payload.message).to.equal('Request failed with status code 500')
        })
    })
  })
})
