jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import * as actions from '../../src/actions/preferencesActions'

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
          { type: 'FETCH_PREFERENCES_REQUESTED', completed: false },
          { type: 'FETCH_PREFERENCES_SUCCESS', completed: true, language: 'br' }
        ]
        const store = mockStore({ preferences: { language: {} } })
        return store.dispatch(actions.fetchPreferences(1)).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})
