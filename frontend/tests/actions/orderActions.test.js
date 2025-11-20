/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as orderActions from '../../src/actions/orderActions'
import * as types from '../../src/actions/orderActions'
import * as typesNotification from '../../src/actions/notificationActions'
import api from '../../src/consts'
import Auth from '../../src/modules/auth'

// Ensure validToken() sets authorization without needing a real token
Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('order actions', () => {
  describe('async actions', () => {
    beforeEach(() => {
      moxios.install()
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('creates CREATE_ORDER_SUCCESS when creating order has been done', () => {
      const orderData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/orders`, {
        status: 200,
        response: orderData,
      })

      const expectedActions = [
        { type: types.CREATE_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.create.success',
          open: true,
        },
        { type: types.CREATE_ORDER_SUCCESS, completed: true, data: orderData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.createOrder(orderData)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2]).to.eql(expectedActions[2])
      })
    })

    it('creates CREATE_ORDER_ERROR when creating order fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.CREATE_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.create.payment.error',
          open: true,
        },
        {
          type: types.CREATE_ORDER_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.createOrder({})).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].completed).to.equal(expectedActions[2].completed)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })

    it('creates LIST_ORDERS_SUCCESS when listing orders has been done', () => {
      const ordersData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/orders`, {
        status: 200,
        response: ordersData,
      })

      const expectedActions = [
        { type: types.LIST_ORDERS_REQUESTED, completed: false },
        { type: types.LIST_ORDERS_SUCCESS, completed: true, data: ordersData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.listOrders()).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    it('creates LIST_ORDERS_ERROR when listing orders fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.LIST_ORDERS_REQUESTED, completed: false },
        { type: typesNotification.ADD_NOTIFICATION, text: 'actions.order.list.error', open: true },
        {
          type: types.LIST_ORDERS_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.listOrders()).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].completed).to.equal(expectedActions[2].completed)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })
    it('creates DETAIL_ORDER_SUCCESS when detailing order has been done', () => {
      const orderData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/orders/1`, {
        status: 200,
        response: orderData,
      })

      const expectedActions = [
        { type: types.DETAILS_ORDER_REQUESTED, completed: false },
        { type: types.DETAILS_ORDER_SUCCESS, completed: true, order: orderData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.detailOrder(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })
    xit('creates DETAIL_ORDER_ERROR when detailing order fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders/1`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.DETAILS_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.details.error',
          open: true,
        },
        {
          type: types.DETAILS_ORDER_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.detailOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].completed).to.equal(expectedActions[2].completed)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })
    it('creates REFUND_ORDER_SUCCESS when refunding order has been done', () => {
      const orderData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/orders/1/refund`, {
        status: 200,
        response: orderData,
      })

      const expectedActions = [
        { type: types.REFUND_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.refund.success',
          open: true,
        },
        { type: types.REFUND_ORDER_SUCCESS, completed: true, order: orderData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.refundOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2]).to.eql(expectedActions[2])
      })
    })
    xit('creates REFUND_ORDER_ERROR when refunding order fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders/1/refund`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.REFUND_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.cancel.payment.error',
          open: true,
        },
        {
          type: types.REFUND_ORDER_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.refundOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.eql(expectedActions[2].type)
        expect(actions[2].completed).to.eql(expectedActions[2].completed)
        expect(actions[2].error.message).to.eql(expectedActions[2].error.message)
      })
    })
    it('creates PAY_ORDER_SUCCESS when paying order has been done', () => {
      const orderData = { id: 1, transfer_id: 'tr_123' }
      moxios.stubRequest(`${api.API_URL}/orders/1/payments`, {
        status: 200,
        response: orderData,
      })

      const expectedActions = [
        { type: types.PAY_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.create.payment.send.success',
          open: true,
        },
        { type: types.PAY_ORDER_SUCCESS, completed: true, order: orderData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.payOrder({ id: 1 })).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.eql(expectedActions[2].type)
        expect(actions[2].completed).to.eql(expectedActions[2].completed)
        expect(actions[2].order.data).to.eql(expectedActions[2].order)
      })
    })
    it('creates PAY_ORDER_ERROR when paying order fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders/1/payments`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.PAY_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.create.payment.send.error',
          open: true,
        },
        {
          type: types.PAY_ORDER_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.payOrder({ id: 1 })).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.eql(expectedActions[2].type)
        expect(actions[2].completed).to.eql(expectedActions[2].completed)
        expect(actions[2].error.message).to.eql(expectedActions[2].error.message)
      })
    })
    it('creates CANCEL_ORDER_SUCCESS when canceling order has been done', () => {
      const orderData = { id: 1, status: 'canceled' }
      moxios.stubRequest(`${api.API_URL}/orders/1/cancel`, {
        status: 200,
        response: orderData,
      })

      const expectedActions = [
        { type: types.CANCEL_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.cancel.success',
          open: true,
        },
        { type: types.CANCEL_ORDER_SUCCESS, completed: true, order: orderData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.cancelOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].completed).to.equal(expectedActions[2].completed)
        expect(actions[2].order.data).to.eql(expectedActions[2].order)
      })
    })
    it('creates CANCEL_ORDER_ERROR when canceling order fails', () => {
      moxios.stubRequest(`${api.API_URL}/orders/1/cancel`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.CANCEL_ORDER_REQUESTED, completed: false },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.order.cancel.payment.error',
          open: true,
        },
        {
          type: types.CANCEL_ORDER_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(orderActions.cancelOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].completed).to.equal(expectedActions[2].completed)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })
  })
})
