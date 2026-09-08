import axios from 'axios'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { thunk } from 'redux-thunk'
import { fetchProject, listProjects } from '../../src/actions/projectActions'
import { project, projects } from '../../src/reducers/projectReducer'

jest.mock('axios')

describe.each([
  [
    'fetchProject',
    () => fetchProject(7, { status: 'open' }),
    'project',
    { id: 7 },
    'FETCH_PROJECT'
  ],
  ['listProjects', () => listProjects(), 'projects', [{ id: 7 }], 'LIST_PROJECTS']
])('%s completion', (name, action, stateKey, responseData, prefix) => {
  let store

  beforeEach(() => {
    jest.clearAllMocks()
    store = createStore(
      combineReducers({ project, projects, intl: () => ({ messages: {} }) }),
      applyMiddleware(thunk)
    )
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => jest.restoreAllMocks())

  it('waits for the HTTP response and the reducer update before resolving', async () => {
    let resolveRequest
    axios.get.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )

    const completion = store.dispatch(action())
    expect(completion).toEqual(expect.any(Promise))
    let settled = false
    completion.then(() => {
      settled = true
    })
    await Promise.resolve()
    expect(settled).toBe(false)
    expect(store.getState()[stateKey].completed).toBe(false)

    resolveRequest({ data: responseData })
    await expect(completion).resolves.toMatchObject({ type: `${prefix}_SUCCESS` })
    expect(store.getState()[stateKey]).toMatchObject({ completed: true, data: responseData })
  })

  it('resolves to the error action after a network failure is reduced', async () => {
    const error = new Error('Network Error')
    axios.get.mockRejectedValue(error)
    await expect(store.dispatch(action())).resolves.toMatchObject({
      type: `${prefix}_ERROR`,
      error
    })
    expect(store.getState()[stateKey]).toMatchObject({ completed: true, error })
  })

  it('resolves to the error action when the response has no project data', async () => {
    axios.get.mockResolvedValue({ data: null })
    await expect(store.dispatch(action())).resolves.toMatchObject({ type: `${prefix}_ERROR` })
    expect(store.getState()[stateKey].completed).toBe(true)
    expect(store.getState()[stateKey].error).toEqual({ message: 'actions.task.fetch.unavailable' })
  })
})
