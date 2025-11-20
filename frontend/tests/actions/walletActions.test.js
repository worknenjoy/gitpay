/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import { expect } from 'chai'
import * as walletActions from '../../src/actions/walletActions'
import * as types from '../../src/actions/walletActions'
import * as typesNotification from '../../src/actions/notificationActions'
import api from '../../src/consts'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('wallet actions', () => {
  describe('action creators', () => {
    it('should create wallet action objects', () => {
      expect(walletActions.createWalletRequested()).to.eql({
        type: types.CREATE_WALLET_REQUESTED,
      })
      expect(walletActions.createWalletSuccess({ id: 1 })).to.eql({
        type: types.CREATE_WALLET_SUCCESS,
        wallet: { id: 1 },
      })
      expect(walletActions.createWalletError({ error: true })).to.eql({
        type: types.CREATE_WALLET_ERROR,
        error: { error: true },
      })
      expect(walletActions.listWalletsRequested()).to.eql({
        type: types.LIST_WALLETS_REQUESTED,
        completed: false,
      })
      expect(walletActions.listWalletsSuccess([{ id: 1 }])).to.eql({
        type: types.LIST_WALLETS_SUCCESS,
        completed: true,
        wallets: [{ id: 1 }],
      })
      expect(walletActions.listWalletsError({ error: true })).to.eql({
        type: types.LIST_WALLETS_ERROR,
        completed: true,
        error: { error: true },
      })
      expect(walletActions.fetchWalletRequested()).to.eql({
        type: types.FETCH_WALLET_REQUESTED,
        completed: false,
      })
      expect(walletActions.fetchWalletSuccess({ id: 1 })).to.eql({
        type: types.FETCH_WALLET_SUCCESS,
        completed: true,
        wallet: { id: 1 },
      })
      expect(walletActions.fetchWalletError({ error: true })).to.eql({
        type: types.FETCH_WALLET_ERROR,
        completed: true,
        error: { error: true },
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

    it('creates CREATE_WALLET_SUCCESS when creating wallet has been done', () => {
      const walletData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/wallets`, {
        status: 200,
        response: walletData,
      })

      const expectedActions = [
        { type: types.CREATE_WALLET_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.wallet.create.success',
          open: true,
        },
        { type: types.CREATE_WALLET_SUCCESS, wallet: walletData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.createWallet(walletData)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2]).to.eql(expectedActions[2])
      })
    })

    it('creates CREATE_WALLET_ERROR when creating wallet fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.CREATE_WALLET_REQUESTED },
        {
          type: typesNotification.ADD_NOTIFICATION,
          text: 'actions.wallet.create.error',
          open: true,
        },
        {
          type: types.CREATE_WALLET_ERROR,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.createWallet({})).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].text).to.equal(expectedActions[1].text)
        expect(actions[1].open).to.equal(expectedActions[1].open)
        expect(actions[2].type).to.equal(expectedActions[2].type)
        expect(actions[2].error.message).to.equal(expectedActions[2].error.message)
      })
    })

    it('creates LIST_WALLETS_SUCCESS when listing wallets has been done', () => {
      const walletsData = [{ id: 1 }]
      moxios.stubRequest(`${api.API_URL}/wallets`, {
        status: 200,
        response: walletsData,
      })

      const expectedActions = [
        { type: types.LIST_WALLETS_REQUESTED, completed: false },
        { type: types.LIST_WALLETS_SUCCESS, completed: true, wallets: walletsData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.listWallets()).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    it('creates LIST_WALLETS_ERROR when listing wallets fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.LIST_WALLETS_REQUESTED, completed: false },
        {
          type: types.LIST_WALLETS_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.listWallets()).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].completed).to.equal(expectedActions[1].completed)
        expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
      })
    })

    it('creates FETCH_WALLET_SUCCESS when fetching wallet has been done', () => {
      const walletData = { id: 1 }
      moxios.stubRequest(`${api.API_URL}/wallets/1`, {
        status: 200,
        response: walletData,
      })

      const expectedActions = [
        { type: types.FETCH_WALLET_REQUESTED, completed: false },
        { type: types.FETCH_WALLET_SUCCESS, completed: true, wallet: walletData },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.fetchWallet(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions)
      })
    })

    it('creates FETCH_WALLET_ERROR when fetching wallet fails', () => {
      moxios.stubRequest(`${api.API_URL}/wallets/1`, {
        status: 500,
      })

      const expectedActions = [
        { type: types.FETCH_WALLET_REQUESTED, completed: false },
        {
          type: types.FETCH_WALLET_ERROR,
          completed: true,
          error: new Error('Request failed with status code 500'),
        },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store.dispatch(walletActions.fetchWallet(1)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).to.eql(expectedActions[0])
        expect(actions[1].type).to.equal(expectedActions[1].type)
        expect(actions[1].completed).to.equal(expectedActions[1].completed)
        expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
      })
    })
  })
})
