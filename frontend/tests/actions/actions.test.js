jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import * as actions from '../../src/actions/preferencesActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  beforeEach(() => {

  })
  describe('country and language preference actions', () => {
    it('should dispatch a action to get the current language', () => {
      expect(actions.fetchPreferencesRequested()).toEqual({
        type: 'FETCH_PREFERENCES_REQUESTED',
        completed: false
      })
      expect(actions.fetchPreferencesSuccess({
        language: 'br'
      })).toEqual({
        type: 'FETCH_PREFERENCES_SUCCESS',
        completed: true,
        language: 'br'
      })
      expect(actions.fetchPreferencesError({ error: true })).toEqual({
        type: 'FETCH_PREFERENCES_ERROR',
        completed: true,
        error: { error: true }
      })
    })
  })
  describe('async actions', () => {
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
          { completed: true, logged: true, type: 'LOGGED_IN_SUCCESS', user: { id: 1 } },
          { completed: false, type: 'FETCH_PREFERENCES_REQUESTED' },
          { completed: true, type: 'FETCH_PREFERENCES_SUCCESS', language: 'br' }
        ]
        const store = mockStore({ intl: { messages: {} }, preferences: { language: {} }, loggedIn: { logged: true, user: { id: 1 } } })
        return store.dispatch(actions.fetchPreferences(1)).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})
