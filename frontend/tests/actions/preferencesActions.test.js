/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as preferencesActions from '../../src/actions/preferencesActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('preference actions', () => {
  describe('country and language preference actions', () => {
    it('should dispatch a action to get the current language', () => {
      expect(preferencesActions.fetchPreferencesRequested()).toEqual({
        type: 'FETCH_PREFERENCES_REQUESTED',
        completed: false
      })
      expect(
        preferencesActions.fetchPreferencesSuccess({
          language: 'br'
        })
      ).toEqual({
        type: 'FETCH_PREFERENCES_SUCCESS',
        completed: true,
        language: 'br'
      })
      expect(preferencesActions.fetchPreferencesError({ error: true })).toEqual({
        type: 'FETCH_PREFERENCES_ERROR',
        completed: true,
        error: { error: true }
      })
    })
  })

  xdescribe('async actions', () => {
    describe('fetch language', () => {
      beforeEach(() => {
        moxios.install()
      })

      afterEach(() => {
        moxios.uninstall()
      })

      it('fetches the language successfully', () => {
        moxios.stubRequest('http://localhost:3000/authenticated', {
          status: 200,
          response: {
            authenticated: true,
            user: {
              id: 1
            }
          }
        })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          request.respondWith({
            status: 200,
            response: {
              language: 'br'
            }
          })
        })
        const expectedActions = [
          { completed: false, logged: false, type: 'LOGGED_IN_REQUESTED' },
          { open: true, text: 'user.login.successfull', type: 'ADD_NOTIFICATION' },
          { completed: true, logged: true, type: 'LOGGED_IN_SUCCESS', data: { id: 1 } },
          { completed: false, type: 'FETCH_PREFERENCES_REQUESTED' },
          { completed: true, type: 'FETCH_PREFERENCES_SUCCESS', language: 'br' }
        ]
        const store = mockStore({
          intl: { messages: {} },
          preferences: { language: {} },
          loggedIn: { logged: true, data: { id: 1 } }
        })
        return store.dispatch(preferencesActions.fetchPreferences(1)).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})
