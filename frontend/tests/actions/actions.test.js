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

xdescribe('actions', () => {
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
        const store = mockStore({ intl: { messages: {} }, task: { completed: true, id: 1 }, loggedIn: { logged: true, user: { id: 1 } } })
        return store.dispatch(taskActions.messageAuthor(1, 1, 'message')).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
      })
    })
  })
  describe('recruitment landing page actions', () => {
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
  describe('preference actions', () => {
    beforeEach(() => {

    })
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
        expect(preferencesActions.fetchPreferencesError({ error: true })).toEqual({
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
          return store.dispatch(preferencesActions.fetchPreferences(1)).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })
    })
  })
  describe('organization actions', () => {
    describe('should get organizations from that user', () => {
      it('should dispatch a action to get the organizations', () => {
        expect(organizationsActions.fetchOrganizationsRequested()).toEqual({
          type: 'FETCH_ORGANIZATIONS_REQUESTED',
          completed: false
        })
        expect(organizationsActions.fetchOrganizationsSuccess({
          organizations: []
        })).toEqual({
          type: 'FETCH_ORGANIZATIONS_SUCCESS',
          completed: true,
          organizations: { 'organizations': [] }
        })
        expect(organizationsActions.fetchOrganizationsError({ error: true })).toEqual({
          type: 'FETCH_ORGANIZATIONS_ERROR',
          completed: true,
          error: { error: true }
        })
      })
    })
    describe('should create organization', () => {
      it('should dispatch a action to create organizations', () => {
        expect(organizationsActions.createOrganizationsRequested({
          name: 'test',
          UserId: 1
        })).toEqual({
          type: 'CREATE_ORGANIZATIONS_REQUESTED',
          completed: false
        })
        expect(organizationsActions.createOrganizationsSuccess({
          organizations: []
        })).toEqual({
          type: 'CREATE_ORGANIZATIONS_SUCCESS',
          completed: true,
          organizations: { 'organizations': [] }
        })
        expect(organizationsActions.createOrganizationsError({ error: true })).toEqual({
          type: 'CREATE_ORGANIZATIONS_ERROR',
          completed: true,
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

      it('fetches the organizations successfully', () => {
        moxios.stubRequest('http://localhost:3000/authenticated', {
          status: 200,
          response: {
            authenticated: true,
            user: {
              id: 2
            }
          }
        })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          request.respondWith({
            status: 200,
            response: {
              organizations: [{ 'name': 'test org' }]
            }
          })
        })
        const expectedActions = [
          { completed: false, logged: false, type: 'LOGGED_IN_REQUESTED' },
          // { open: true, text: 'user.login.successfull', type: 'ADD_NOTIFICATION' },
          { completed: true, logged: true, type: 'LOGGED_IN_SUCCESS', user: { id: 2 } },
          { completed: false, type: 'FETCH_ORGANIZATIONS_REQUESTED' },
          { completed: true, type: 'FETCH_ORGANIZATIONS_SUCCESS', organizations: { 'organizations': [{ 'name': 'test org' }] } }
        ]
        const store = mockStore({ intl: { messages: {} }, organizations: { 'organizations': [{ 'name': 'test org' }] }, loggedIn: { logged: true, user: { id: 2 } } })
        return store.dispatch(organizationsActions.fetchOrganizations(2)).then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})
