/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as walletOrderActions from '../../src/actions/walletOrderActions'
import * as types from '../../src/actions/walletOrderActions'
import * as typesNotification from '../../src/actions/notificationActions'
import api from '../../src/consts'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

xdescribe('wallet order actions', () => {
  describe('action creators', () => {
    it('should create wallet order action objects', () => {
      expect(walletOrderActions.createWalletOrderRequested()).to.eql({
        type: types.CREATE_WALLET_ORDER_REQUESTED
      })
      expect(walletOrderActions.createWalletOrderSuccess({ id: 1 })).to.eql({
        type: types.CREATE_WALLET_ORDER_SUCCESS,
        walletOrder: { id: 1 }
      })
      expect(walletOrderActions.createWalletOrderError({ error: true })).to.eql({
        type: types.CREATE_WALLET_ORDER_ERROR,
        error: { error: true }
      })
      expect(walletOrderActions.listWalletOrdersRequested()).to.eql({
        type: types.LIST_WALLET_ORDERS_REQUESTED,
        completed: false
      })
      expect(walletOrderActions.listWalletOrdersSuccess([{ id: 1 }])).to.eql({
        type: types.LIST_WALLET_ORDERS_SUCCESS,
        completed: true,
        walletOrders: [{ id: 1 }]
      })
      expect(walletOrderActions.listWalletOrdersError({ error: true })).to.eql({
        type: types.LIST_WALLET_ORDERS_ERROR,
        completed: true,
        error: { error: true }
      })
      expect(walletOrderActions.fetchWalletOrderRequested()).to.eql({
        type: types.FETCH_WALLET_ORDER_REQUESTED
      })
      expect(walletOrderActions.fetchWalletOrderSuccess({ id: 1 })).to.eql({
        type: types.FETCH_WALLET_ORDER_SUCCESS,
        walletOrder: { id: 1 }
      })
      expect(walletOrderActions.fetchWalletOrderError({ error: true })).to.eql({
        type: types.FETCH_WALLET_ORDER_ERROR,
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

    it('creates CREATE_WALLET_ORDER_SUCCESS when creating wallet order has been done', () => {
      const walletOrderData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/wallets/orders`, {
        status: 200,
        response: walletOrderData
      })

      const expectedActions = [
        { type: types.CREATE_WALLET_ORDER_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.walletOrder.create.success',
          open: true
        },
        { type: types.CREATE_WALLET_ORDER_SUCCESS, walletOrder: walletOrderData }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.createWalletOrder(walletOrderData)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2]).to.eql(expectedActions[2])
      })
    })

    it('creates CREATE_WALLET_ORDER_ERROR when creating wallet order fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets/orders`, {
        status: 500
      })

      const expectedActions = [
        { type: types.CREATE_WALLET_ORDER_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.walletOrder.create.error',
          open: true
        },
        {
          type: types.CREATE_WALLET_ORDER_ERROR,
          error: new Error('Request failed with status code 500')
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.createWalletOrder({})).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })

    it('creates LIST_WALLET_ORDERS_SUCCESS when listing wallet orders has been done', () => {
      const walletOrdersData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/wallets/orders`, {
        status: 200,
        response: walletOrdersData
      })

      const expectedActions = [
        { type: types.LIST_WALLET_ORDERS_REQUESTED, completed: false },
        { type: types.LIST_WALLET_ORDERS_SUCCESS, completed: true, walletOrders: walletOrdersData }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.listWalletOrders(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    it('creates LIST_WALLET_ORDERS_ERROR when listing wallet orders fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets/orders`, {
        status: 500
      })

      const expectedActions = [
        { type: types.LIST_WALLET_ORDERS_REQUESTED, completed: false },
        {
          type: types.LIST_WALLET_ORDERS_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500')
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.listWalletOrders(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].completed).to.equal(expectedActions[1].completed)
        expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
      })
    })

    it('creates FETCH_WALLET_ORDER_SUCCESS when fetching wallet order has been done', () => {
      const walletOrderData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/wallets/orders/1`, {
        status: 200,
        response: walletOrderData
      })

      const expectedActions = [
        { type: types.FETCH_WALLET_ORDER_REQUESTED },
        { type: types.FETCH_WALLET_ORDER_SUCCESS, walletOrder: walletOrderData }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.fetchWalletOrder(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    it('creates FETCH_WALLET_ORDER_ERROR when fetching wallet order fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets/orders/1`, {
        status: 500
      })

      const expectedActions = [
        { type: types.FETCH_WALLET_ORDER_REQUESTED },
        {
          type: types.FETCH_WALLET_ORDER_ERROR,
          error: new Error('Request failed with status code 500')
        }
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletOrderActions.fetchWalletOrder(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
      })
    })
  })
})
