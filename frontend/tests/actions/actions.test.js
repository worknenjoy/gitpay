/**
 * @jest-environment jsdom
 */

jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import * as preferencesActions from '../../src/actions/preferencesActions'
import * as organizationsActions from '../../src/actions/organizationsActions'
import * as taskActions from '../../src/actions/taskActions'
import * as contactActions from '../../src/actions/contactActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  describe('task actions', () => {
    describe('message author', () => {
      it('should dispatch an action to send message to author', () => {
        expect(taskActions.messageAuthorRequested()).toEqual({
          type: 'MESSAGE_AUTHOR_REQUESTED',
          completed: false
        })
        expect(taskActions.messageAuthorSuccess()).toEqual({
          type: 'MESSAGE_AUTHOR_SUCCESS',
          completed: true
        })
        expect(taskActions.messageAuthorError({ code: 401 })).toEqual({
          type: 'MESSAGE_AUTHOR_ERROR',
          completed: true,
          error: { code: 401 }
        })
      })
      it('should dispatch an action to send message to author async', () => {
        moxios.install()
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
            response: {}
          })
        })
        const expectedActions = [
          { completed: false, type: 'MESSAGE_AUTHOR_REQUESTED' },
          { open: true, text: 'actions.task.message.author.success', type: 'ADD_NOTIFICATION' },
          { completed: true, type: 'MESSAGE_AUTHOR_SUCCESS' }
        ]
        const store = mockStore({ 
          intl: { messages: {} }, 
          task: { completed: true, id: 1 }, 
          loggedIn: { logged: true, user: { id: 1 } } 
        })
        return store.dispatch(taskActions.messageAuthor(1, 1, 'message')).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
      })
    })
  })
  describe('contact actions', () => {
    describe('message recruiters', () => {
      it('should dispatch an action to send message to recruitment team', () => {
        expect(contactActions.messageRecruitersRequested()).toEqual({
          type: 'MESSAGE_RECRUITERS_REQUESTED',
          completed: false
        })
        expect(contactActions.messageRecruitersSuccess()).toEqual({
          type: 'MESSAGE_RECRUITERS_SUCCESS',
          completed: true
        })
        expect(contactActions.messageRecruitersError({ code: 401 })).toEqual({
          type: 'MESSAGE_RECRUITERS_ERROR',
          completed: true,
          error: { code: 401 }
        })
      })
      it('should dispatch an action to send message to recruiters async', () => {
        moxios.install()
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          request.respondWith({
            status: 200,
            response: {}
          })
        })
        const expectedActions = [
          { completed: false, type: 'MESSAGE_RECRUITERS_REQUESTED' },
          { open: true, text: 'actions.message.recruiters.success', type: 'ADD_NOTIFICATION' },
          { completed: true, type: 'MESSAGE_RECRUITERS_SUCCESS' }
        ]
        const store = mockStore({ intl: { messages: {} } })
        return store.dispatch(contactActions.messageRecruiters('name', 'title', 'email', 'phone', 'company', 'country', 'message')).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
      })
    })
  })
  describe('preferences actions', () => {
    describe('country and language preference actions', () => {
      it('should dispatch a action to get the current language', () => {
        expect(preferencesActions.fetchPreferencesRequested()).toEqual({
          type: 'FETCH_PREFERENCES_REQUESTED',
          completed: false
        })
        expect(preferencesActions.fetchPreferencesSuccess({
          language: 'br'
        })).toEqual({
          type: 'FETCH_PREFERENCES_SUCCESS',
          completed: true,
          language: 'br'
        })
        expect(preferencesActions
