/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as paymentRequestActions from '../../src/actions/paymentRequestActions'
import * as types from '../../src/actions/paymentRequestActions'
import * as typesNotification from '../../src/actions/notificationActions'
import api from '../../src/consts'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('paymentRequest actions', () => {
  describe('action creators', () => {
    it('should create paymentRequest action objects', () => {
      expect(paymentRequestActions.createPaymentRequestRequested()).to.eql({
        type: types.CREATE_PAYMENT_REQUEST_REQUESTED
      })
      expect(paymentRequestActions.createPaymentRequestSuccess({ id: 1 })).to.eql({
        type: types.CREATE_PAYMENT_REQUEST_SUCCESS,
        paymentRequest: { id: 1 }
      })
      expect(paymentRequestActions.createPaymentRequestError({ error: true })).to.eql({
        type: types.CREATE_PAYMENT_REQUEST_ERROR,
        error: { error: true }
      })
      expect(paymentRequestActions.listPaymentRequestsRequested()).to.eql({
        type: types.LIST_PAYMENT_REQUESTS_REQUESTED,
        completed: false
      })
      expect(paymentRequestActions.listPaymentRequestsSuccess([{ id: 1 }])).to.eql({
        type: types.LIST_PAYMENT_REQUESTS_SUCCESS,
        completed: true,
        paymentRequests: [{ id: 1 }]
      })
      expect(paymentRequestActions.listPaymentRequestsError({ error: true })).to.eql({
        type: types.LIST_PAYMENT_REQUESTS_ERROR,
        completed: true,
        error: { error: true }
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

    it('creates CREATE_PAYMENT_REQUEST_SUCCESS when creating paymentRequest has been done', () => {
      const paymentRequestData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/payment-requests`, {
        status: 200,
        response: paymentRequestData
      })

      const expectedActions = [
        { type: types.CREATE_PAYMENT_REQUEST_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.paymentRequest.create.success',
          open: true
        },
        { type: types.CREATE_PAYMENT_REQUEST_SUCCESS, paymentRequest: paymentRequestData }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch(paymentRequestActions.createPaymentRequest(paymentRequestData))
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).to.eql(expectedActions[0])
          expect(actions[1].type).to.equal(expectedActions[1].type)
          expect(actions[1].text).to.equal(expectedActions[1].text)
          expect(actions[1].open).to.equal(expectedActions[1].open)
          expect(actions[2]).to.eql(expectedActions[2])
        })
    })

    xit('creates CREATE_PAYMENT_REQUEST_ERROR when creating paymentRequest fails', () => {
      moxios.stubRequest(`${api.API_URL}/payment-requests`, {
        status: 500
      })

      const expectedActions = [
        { type: types.CREATE_PAYMENT_REQUEST_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.paymentRequest.create.error',
          open: true
        },
        {
          type: types.CREATE_PAYMENT_REQUEST_ERROR,
          error: new Error('Request failed with status code 500')
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(paymentRequestActions.createPaymentRequest({})).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })

    it('creates LIST_PAYMENT_REQUESTS_SUCCESS when listing paymentRequests has been done', () => {
      const paymentRequestsData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/payment-requests`, {
        status: 200,
        response: paymentRequestsData
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUESTS_REQUESTED, completed: false },
        {
          type: types.LIST_PAYMENT_REQUESTS_SUCCESS,
          completed: true,
          paymentRequests: paymentRequestsData
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(paymentRequestActions.listPaymentRequests()).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    xit('creates LIST_PAYMENT_REQUESTS_ERROR when listing paymentRequests fails', () => {
      moxios.stubRequest(`${api.API_URL}/payment-requests`, {
        status: 500
      })

      const expectedActions = [
        { type: types.LIST_PAYMENT_REQUESTS_REQUESTED, completed: false },
        {
          type: types.LIST_PAYMENT_REQUESTS_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500')
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(paymentRequestActions.listPaymentRequests()).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].completed).to.equal(expectedActions[1].completed)
        expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
      })
    })
  })
})
