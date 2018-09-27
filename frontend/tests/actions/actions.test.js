import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios';
import * as actions from '../../src/actions/preferencesActions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  describe('country and language preference actions', () =>{
    it('should dispatch a action to get the current language', () => {
      expect(actions.fetchLangRequested()).toEqual({ 
        type: 'FETCH_LANGUAGE_REQUESTED',
        completed: false 
      })
      expect(actions.fetchLangSuccess({
        data: {
          lang: 'br'
        }
      })).toEqual({ 
        type: 'FETCH_LANGUAGE_SUCCESS',
        completed: true, 
        lang: 'br' 
      })
      expect(actions.fetchLangError({error: true})).toEqual({ 
        type: 'FETCH_LANGUAGE_ERROR',
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
              data: {
                lang: 'br'
              }
            }
          })
        })
  
        const expectedActions = [
          { type: 'FETCH_LANGUAGE_REQUESTED', completed: false },
          { type: 'FETCH_LANGUAGE_SUCCESS', completed: true, lang: 'br' }
        ]
        const store = mockStore({ lang: {} })
        return store.dispatch(actions.fetchLanguage()).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
  
      })
    })
  })
})
