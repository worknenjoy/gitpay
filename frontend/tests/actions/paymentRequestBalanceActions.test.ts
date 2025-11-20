/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as paymentRequestBalanceActions from '../../src/actions/paymentRequestBalanceActions'
import * as types from '../../src/actions/paymentRequestBalanceActions'
import api from '../../src/consts'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares as any[])

describe('paymentRequestBalance actions', () => {
  describe('action creators', () => {
    it('should create paymentRequestBalance action objects', () => {
      // requested without payload
      expect(paymentRequestBalanceActions.listPaymentRequestBalanceRequested()).to.eql({
        type: types.LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
        payload: undefined
      })

      // requested with payload
      const reqPayload = { page: 1 }
      expect(paymentRequestBalanceActions.listPaymentRequestBalanceRequested(reqPayload)).to.eql({
        type: types.LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
        payload: reqPayload
      })

      // succeeded
      const successPayload = [{ id: 1 }]
      expect(
        paymentRequestBalanceActions.listPaymentRequestBalanceSucceeded(successPayload)
      ).to.eql({
        type: types.LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED,
        payload: successPayload
      })

      // failed
      const errorPayload = { error: true }
      expect(paymentRequestBalanceActions.listPaymentRequestBalanceFailed(errorPayload)).to.eql({
        type: types.LIST_PAYMENT_REQUEST_BALANCE_FAILED,
        payload: errorPayload
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

    it('creates LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED when listing balances succeeds', () => {
      const balancesData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/payment-request-balances`, {
        status: 200,
        response: balancesData
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUEST_BALANCE_REQUESTED, payload: undefined },
        { type: types.LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED, payload: balancesData }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestBalanceActions.listPaymentRequestBalances())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })

    it('creates LIST_PAYMENT_REQUEST_BALANCE_FAILED when API returns error in body', () => {
      const apiError = 'Something went wrong'
      moxios.stubRequest(`${api.API_URL}/payment-request-balances`, {
        status: 200,
        response: { error: apiError }
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUEST_BALANCE_REQUESTED, payload: undefined },
        { type: types.LIST_PAYMENT_REQUEST_BALANCE_FAILED, payload: apiError }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestBalanceActions.listPaymentRequestBalances())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })

    it('creates LIST_PAYMENT_REQUEST_BALANCE_FAILED when listing balances fails (HTTP 500)', () => {
      moxios.stubRequest(`${api.API_URL}/payment-request-balances`, {
        status: 500
      })

      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch<any>(paymentRequestBalanceActions.listPaymentRequestBalances())
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).to.eql({
            type: types.LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
            payload: undefined
          })
          expect(actions[1].type).to.equal(types.LIST_PAYMENT_REQUEST_BALANCE_FAILED)
          expect(actions[1].payload).to.be.an('error')
          expect(actions[1].payload.message).to.equal('Request failed with status code 500')
        })
    })
  })
})
