/**
 * @jest-environment jsdom
 */

jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as taskActions from '../../../src/actions/taskActions'
import Auth from '../../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('task actions', () => {
  describe('task update', () => {
    it('should dispatch an action to update task', () => {
      const taskResponse = {
        id: 1
      }
      moxios.install()
      moxios.stubRequest('http://localhost:3000/authenticated', {
        status: 200,
        response: {
          authenticated: true,
          data: {
            id: 1
          }
        }
      })
      moxios.stubRequest('http://localhost:3000/tasks/update', {
        status: 200,
        response: taskResponse
      })
      moxios.stubRequest('http://localhost:3000/tasks/fetch/1', {
        status: 200,
        response: taskResponse
      })
      moxios.stubRequest('http://localhost:3000/tasks/1/sync/value', {
        status: 200,
        response: taskResponse
      })
      const expectedActions = [
        { completed: false, type: 'UPDATE_TASK_REQUESTED' },
        {
          open: true,
          text: 'actions.task.update.notification.success',
          type: 'ADD_NOTIFICATION',
          link: undefined
        },
        { completed: true, type: 'UPDATE_TASK_SUCCESS' },
        { completed: false, type: 'SYNC_TASK_REQUESTED' },
        { completed: false, type: 'FETCH_TASK_REQUESTED' },
        { completed: true, type: 'SYNC_TASK_SUCCESS', values: { id: 1 } },
        { completed: true, type: 'FETCH_TASK_SUCCESS', data: { id: 1 } }
      ]
      const store = mockStore({
        intl: { messages: {} },
        task: { completed: true, data: { id: 1 } },
        loggedIn: { logged: true, data: { id: 1 } }
      })
      return store
        .dispatch(
          taskActions.updateTask({
            id: 1
          })
        )
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
    })
  })

  describe('delte task by id ', () => {
    it('should dispatch an action to delete task by id', () => {
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
      moxios.stubRequest('http://localhost:3000/tasks/delete/1', {
        status: 200,
        response: '1'
      })
      const expectedActions = [
        { completed: false, type: 'DELETE_TASK_REQUESTED' },
        {
          open: true,
          text: 'actions.task.delete.notification.success',
          type: 'ADD_NOTIFICATION',
          link: undefined
        },
        { completed: true, type: 'DELETE_TASK_SUCCESS' }
      ]
      const store = mockStore({
        intl: { messages: {} },
        task: { completed: true, id: 1 },
        loggedIn: { logged: true, user: { id: 1 } }
      })
      return store.dispatch(taskActions.deleteTask({ id: 1 })).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
        moxios.uninstall()
      })
    })
    it('should dispatch an action to fail to delete task when order is associated', () => {
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
      moxios.stubRequest('http://localhost:3000/tasks/delete/1', {
        status: 500,
        response: { error: 'CANNOT_DELETE_ISSUE_WITH_ORDERS_ASSOCIATED' }
      })
      const expectedActions = [
        { completed: false, type: 'DELETE_TASK_REQUESTED' },
        {
          open: true,
          text: 'actions.task.delete.notification.error.associated.orders',
          type: 'ADD_NOTIFICATION',
          link: undefined,
          severity: 'error'
        },
        {
          completed: true,
          type: 'DELETE_TASK_ERROR',
          error: 'CANNOT_DELETE_ISSUE_WITH_ORDERS_ASSOCIATED'
        }
      ]
      const store = mockStore({
        intl: { messages: {} },
        task: { completed: true, id: 1 },
        loggedIn: { logged: true, user: { id: 1 } }
      })
      return store.dispatch(taskActions.deleteTask({ id: 1 })).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
        moxios.uninstall()
      })
    })
  })

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
