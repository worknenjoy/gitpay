/**
 * @jest-environment jsdom
 */

jest.unmock('react-intl')
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as taskSolutionActions from '../../../src/actions/taskSolutionActions'
import Auth from '../../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('task solution', () => {
  describe('task solution create', () => {
    it('should dispatch an action to create task solution', () => {
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
        { completed: false, type: 'CREATE_TASK_SOLUTION_REQUESTED' },
        {
          open: true,
          text: 'issue.solution.dialog.create.success',
          type: 'ADD_NOTIFICATION',
          link: undefined
        },
        { completed: false, type: 'FETCH_TASK_REQUESTED' },
        { completed: true, type: 'CREATE_TASK_SOLUTION_SUCCESS', taskSolution: {} }
      ]
      const store = mockStore({
        intl: { messages: {} },
        task: { completed: true, id: 1 },
        loggedIn: { logged: true, user: { id: 1 } }
      })
      return store
        .dispatch(
          taskSolutionActions.createTaskSolution({
            pullRequestId: '2',
            userId: 1,
            repositoryName: 'test-repository',
            owner: 'alexanmtz',
            taskId: 1
          })
        )
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
    })
    it('should dispatch an action to create task solution and fail', () => {
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
          status: 400,
          response: {
            error: 'issue.solution.error.insufficient_capabilities_for_transfer'
          }
        })
      })
      const expectedActions = [
        { completed: false, type: 'CREATE_TASK_SOLUTION_REQUESTED' },
        {
          open: true,
          text: 'issue.solution.error.insufficient_capabilities_for_transfer',
          type: 'ADD_NOTIFICATION',
          link: '/#/profile/payout-settings'
        },
        { completed: false, type: 'FETCH_TASK_REQUESTED' },
        {
          completed: true,
          type: 'CREATE_TASK_SOLUTION_ERROR',
          error: 'issue.solution.error.insufficient_capabilities_for_transfer'
        }
      ]
      const store = mockStore({
        intl: { messages: {} },
        task: { completed: true, id: 1 },
        loggedIn: { logged: true, user: { id: 1 } }
      })
      return store
        .dispatch(
          taskSolutionActions.createTaskSolution({
            pullRequestId: '2',
            userId: 1,
            repositoryName: 'test-repository',
            owner: 'alexanmtz',
            taskId: 1
          })
        )
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
    })
  })
})
