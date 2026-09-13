import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import {
  listProjects,
  LIST_PROJECTS_REQUESTED,
  LIST_PROJECTS_SUCCESS,
  LIST_PROJECTS_ERROR
} from './projectActions'

const mockStore = configureMockStore([thunk])

describe('listProjects', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('sends the given params as the request query and dispatches REQUESTED then SUCCESS', (done) => {
    const store = mockStore({})
    const projects = [{ id: 1, name: 'gitpay', Organization: { id: 9, name: 'worknenjoy' } }]

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toContain('/projects/list')
      expect(request.config.params).toEqual({ userId: 42 })
      request
        .respondWith({
          status: 200,
          response: projects
        })
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({
            type: LIST_PROJECTS_REQUESTED,
            completed: false
          })
          expect(actions[1]).toEqual({
            type: LIST_PROJECTS_SUCCESS,
            completed: true,
            data: projects
          })
          done()
        })
    })

    store.dispatch(listProjects({ userId: 42 }))
  })

  it('works with no params (existing callers pass none)', (done) => {
    const store = mockStore({})

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.config.params).toBeUndefined()
      request.respondWith({ status: 200, response: [] }).then(() => {
        done()
      })
    })

    store.dispatch(listProjects())
  })

  it('dispatches REQUESTED then ERROR when the request fails', (done) => {
    // The error path also dispatches addNotification, which reads
    // state.intl.messages.
    const store = mockStore({ intl: { messages: {} } })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({ status: 500, response: { message: 'boom' } }).then(() => {
        const actions = store.getActions()
        expect(actions[0].type).toBe(LIST_PROJECTS_REQUESTED)
        // The error path also dispatches addNotification before the
        // final LIST_PROJECTS_ERROR action.
        expect(actions[actions.length - 1].type).toBe(LIST_PROJECTS_ERROR)
        done()
      })
    })

    store.dispatch(listProjects({ userId: 42 }))
  })
})
