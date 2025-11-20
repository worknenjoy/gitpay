/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as organizationsActions from '../../src/actions/organizationsActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true
Auth.getAuthNotified = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('organization actions', () => {
  describe('should get organizations from that user', () => {
    it('should dispatch a action to get the organizations', () => {
      expect(organizationsActions.fetchOrganizationsRequested()).toEqual({
        type: 'FETCH_ORGANIZATIONS_REQUESTED',
        completed: false,
      })
      expect(
        organizationsActions.fetchOrganizationsSuccess({
          organizations: [],
        }),
      ).toEqual({
        type: 'FETCH_ORGANIZATIONS_SUCCESS',
        completed: true,
        organizations: { organizations: [] },
      })
      expect(organizationsActions.fetchOrganizationsError({ error: true })).toEqual({
        type: 'FETCH_ORGANIZATIONS_ERROR',
        completed: true,
        error: { error: true },
      })
    })
  })
  describe('should create organization', () => {
    it('should dispatch a action to create organizations', () => {
      expect(
        organizationsActions.createOrganizationsRequested({
          name: 'test',
          UserId: 1,
        }),
      ).toEqual({
        type: 'CREATE_ORGANIZATIONS_REQUESTED',
        completed: false,
      })
      expect(
        organizationsActions.createOrganizationsSuccess({
          organizations: [],
        }),
      ).toEqual({
        type: 'CREATE_ORGANIZATIONS_SUCCESS',
        completed: true,
        organizations: { organizations: [] },
      })
      expect(organizationsActions.createOrganizationsError({ error: true })).toEqual({
        type: 'CREATE_ORGANIZATIONS_ERROR',
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

    it('fetches the organizations successfully', () => {
      moxios.stubRequest('http://localhost:3000/authenticated', {
        status: 200,
        response: {
          authenticated: true,
          user: {
            id: 2,
          },
        },
      })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            organizations: [{ name: 'test org' }],
          },
        })
      })
      const expectedActions = [
        { completed: false, logged: false, type: 'LOGGED_IN_REQUESTED' },
        // { open: true, text: 'user.login.successfull', type: 'ADD_NOTIFICATION' },
        { completed: true, logged: true, type: 'LOGGED_IN_SUCCESS', data: { id: 2 } },
        { completed: false, type: 'FETCH_ORGANIZATIONS_REQUESTED' },
        {
          completed: true,
          type: 'FETCH_ORGANIZATIONS_SUCCESS',
          organizations: { organizations: [{ name: 'test org' }] },
        },
      ]
      const store = mockStore({
        intl: { messages: {} },
        organizations: { organizations: [{ name: 'test org' }] },
        loggedIn: { logged: true, data: { id: 2 } },
      })
      return store.dispatch(organizationsActions.fetchOrganizations(2)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
