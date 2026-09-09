import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import {
  listPublicTaskSolutions,
  LIST_PUBLIC_TASK_SOLUTIONS_REQUESTED,
  LIST_PUBLIC_TASK_SOLUTIONS_SUCCESS,
  LIST_PUBLIC_TASK_SOLUTIONS_ERROR
} from './taskSolutionActions'

const mockStore = configureMockStore([thunk])

describe('listPublicTaskSolutions', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('dispatches REQUESTED then SUCCESS with the fetched pull requests', (done) => {
    const store = mockStore({})
    const taskSolutions = [{ id: 1, pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1' }]

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toContain('/tasksolutions-public/42')
      request
        .respondWith({
          status: 200,
          response: taskSolutions
        })
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({
            type: LIST_PUBLIC_TASK_SOLUTIONS_REQUESTED,
            completed: false
          })
          expect(actions[1]).toEqual({
            type: LIST_PUBLIC_TASK_SOLUTIONS_SUCCESS,
            completed: true,
            taskSolutions
          })
          done()
        })
    })

    store.dispatch(listPublicTaskSolutions(42))
  })

  it('dispatches REQUESTED then ERROR when the request fails', (done) => {
    const store = mockStore({})

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({ status: 500, response: { message: 'boom' } }).then(() => {
        const actions = store.getActions()
        expect(actions[0].type).toBe(LIST_PUBLIC_TASK_SOLUTIONS_REQUESTED)
        expect(actions[1].type).toBe(LIST_PUBLIC_TASK_SOLUTIONS_ERROR)
        done()
      })
    })

    store.dispatch(listPublicTaskSolutions(42))
  })
})
