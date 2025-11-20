/**
 * @jest-environment jsdom
 */
import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as actions from '../../src/actions/userActions'
import * as types from '../../src/actions/userActions'
import * as typesNotification from '../../src/actions/notificationActions'
import api from '../../src/consts'
import StripeAccountInvalidRequest from '../data/create-account-invalid-request.json'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('User Actions', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('creates FETCH_USER_ACCOUNT_SUCCESS when fetching user account has been done', () => {
    const accountData = { data: { id: 1, name: 'Test User' } }
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 200,
      response: accountData.data,
    })

    const expectedActions = [
      { type: types.FETCH_USER_ACCOUNT_REQUESTED, completed: false },
      { type: types.FETCH_USER_ACCOUNT_SUCCESS, completed: true, data: accountData.data },
    ]
    const store = mockStore({
      intl: { messages: {} },
    })

    return store.dispatch(actions.fetchAccount()).then(() => {
      const actions = store.getActions()
      expect(actions).to.eql(expectedActions)
    })
  })

  it('creates FETCH_USER_ACCOUNT_ERROR when fetching user account fails', () => {
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 500,
    })

    const expectedActions = [
      { type: types.FETCH_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: types.FETCH_USER_ACCOUNT_ERROR,
        completed: true,
        error: new Error('Request failed with status code 500'),
      },
    ]
    const store = mockStore({ intl: { messages: {} } })

    return store.dispatch(actions.fetchAccount()).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].completed).to.equal(expectedActions[1].completed)
      expect(actions[1].error.message).to.equal(expectedActions[1].error.message)
    })
  })

  it('creates CREATE_USER_ACCOUNT_SUCCESS when creating user account has been done', () => {
    const accountData = { data: { id: 1, name: 'Test User' } }
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 200,
      response: accountData.data,
    })

    const expectedActions = [
      { type: types.CREATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.create.success',
        open: true,
      },
      { type: types.CREATE_USER_ACCOUNT_SUCCESS, completed: true, data: accountData.data },
    ]
    const store = mockStore({ loggedIn: { data: { account_id: null } }, intl: { messages: {} } })

    return store.dispatch(actions.createAccount('US')).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].text).to.equal(expectedActions[1].text)
      expect(actions[1].open).to.equal(expectedActions[1].open)
    })
  })

  it('creates CREATE_USER_ACCOUNT_ERROR when creating user account fails', () => {
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 500,
    })

    const expectedActions = [
      { type: types.CREATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.create.error',
        open: true,
      },
      {
        type: types.CREATE_USER_ACCOUNT_ERROR,
        completed: true,
        error: new Error('Request failed with status code 500'),
      },
    ]
    const store = mockStore({ loggedIn: { data: { account_id: null } }, intl: { messages: {} } })

    return store.dispatch(actions.createAccount('US')).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].completed).to.equal(expectedActions[1].completed)
      expect(actions[1].error).to.equal(expectedActions[1].error)
    })
  })

  it('creates UPDATE_USER_ACCOUNT_SUCCESS when updating user account has been done', () => {
    const accountData = { data: { id: 1, name: 'Updated User' } }
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 200,
      response: accountData.data,
    })

    const expectedActions = [
      { type: types.UPDATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.update.success',
        open: true,
      },
      { type: types.UPDATE_USER_ACCOUNT_SUCCESS, completed: true, data: accountData.data },
    ]
    const store = mockStore({ intl: { messages: {} } })

    return store.dispatch(actions.updateAccount(null, accountData.data)).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].text).to.equal(expectedActions[1].text)
      expect(actions[1].open).to.equal(expectedActions[1].open)
    })
  })

  it('creates UPDATE_USER_ACCOUNT_ERROR when updating user account fails', () => {
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 500,
    })

    const expectedActions = [
      { type: types.UPDATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.update.error',
        open: true,
      },
      {
        type: types.UPDATE_USER_ACCOUNT_ERROR,
        completed: true,
        error: new Error('Request failed with status code 500'),
      },
    ]
    const store = mockStore({ intl: { messages: {} } })

    return store.dispatch(actions.updateAccount(null, {})).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].completed).to.equal(expectedActions[1].completed)
      expect(actions[1].error).to.equal(expectedActions[1].error)
    })
  })
  it('when user account update fails but returns 200 status code', () => {
    const accountData = { data: { id: 1, name: 'Updated User' } }
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 200,
      response: accountData.data,
    })

    const expectedActions = [
      { type: types.UPDATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.update.error',
        open: true,
      },
      {
        type: types.UPDATE_USER_ACCOUNT_ERROR,
        completed: true,
        error: new Error('Request failed with status code 200'),
      },
    ]
    const store = mockStore({ intl: { messages: {} } })

    return store.dispatch(actions.updateAccount(null, accountData.data)).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].completed).to.equal(expectedActions[1].completed)
      expect(actions[1].error).to.equal(expectedActions[1].error)
    })
  })
  it('when user account update fails but returns 401 status code', () => {
    moxios.stubRequest(`${api.API_URL}/user/account`, {
      status: 401,
      response: StripeAccountInvalidRequest,
    })

    const expectedActions = [
      { type: types.UPDATE_USER_ACCOUNT_REQUESTED, completed: false },
      {
        type: typesNotification.ADD_NOTIFICATION,
        text: 'actions.user.account.update.error.missing',
        open: true,
      },
      {
        type: types.UPDATE_USER_ACCOUNT_ERROR,
        completed: true,
        error: new Error('Request failed with status code 401'),
      },
    ]
    const store = mockStore({
      intl: { messages: { 'actions.user.account.update.error.phone': 'Invalid phone' } },
    })

    return store.dispatch(actions.updateAccount(null, {})).then(() => {
      const actions = store.getActions()
      expect(actions[0]).to.eql(expectedActions[0])
      expect(actions[1].type).to.equal(expectedActions[1].type)
      expect(actions[1].completed).to.equal(expectedActions[1].completed)
      expect(actions[1].error).to.equal(expectedActions[1].error)
      expect(actions[1].text).to.equal(expectedActions[1].text)
    })
  })
})
