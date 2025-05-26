/**
 * @jest-environment jsdom
 */

jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'
import * as taskActions from '../../src/actions/taskActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

xdescribe('task actions', () => {
  describe('task solution update', () => {
    it('should dispatch an action to update task', () => {
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
        const firstRequest = moxios.requests.first()
        firstRequest.respondWith({
          status: 200,
          response: {}
        })
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {}
        })
      })
      const expectedActions = [
        { completed: false, type: 'UPDATE_TASK_REQUESTED' },
        { open: true, text: 'actions.task.update.notification.success', type: 'ADD_NOTIFICATION', link: undefined },
        { completed: true, type: 'UPDATE_TASK_SUCCESS' },
        { completed: false, type: 'FETCH_TASK_REQUESTED' }
      ]
      const store = mockStore({ intl: { messages: {} }, task: { completed: true, id: 1 }, loggedIn: { logged: true, user: { id: 1 } } })
      return store.dispatch(taskActions.updateTask({
        id: 1,
      })).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
        moxios.uninstall()
      })
    })
  })
})