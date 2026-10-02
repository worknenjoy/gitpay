import axios from 'axios'
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import {
  fetchPullRequestData,
  createTaskSolution,
  updateTaskSolution
} from '../../../src/actions/taskSolutionActions'

jest.mock('axios')
jest.mock('../../../src/actions/helpers', () => ({ validToken: jest.fn() }))
jest.mock('../../../src/actions/taskActions', () => ({
  fetchTask: (id) => ({ type: 'REFRESH_TASK', id })
}))

const mockStore = configureMockStore([thunk])
const operations = [
  ['FETCH_PULL_REQUEST_DATA', 'get', () => fetchPullRequestData('owner', 'repo', 2, 1), 'fetch'],
  ['CREATE_TASK_SOLUTION', 'post', () => createTaskSolution({ taskId: 1 }), 'create'],
  [
    'UPDATE_TASK_SOLUTION',
    'patch',
    () =>
      updateTaskSolution({
        taskSolutionId: 3,
        taskId: 1,
        pullRequestURL: 'https://github.com/owner/repo/pull/2'
      }),
    'update'
  ]
]

describe.each(operations)('%s error handling', (type, method, action, notification) => {
  beforeEach(() => jest.clearAllMocks())

  it.each([
    ['network failure', new Error('Network Error')],
    ['timeout', Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })],
    ['missing response body', { response: { status: 500 } }],
    ['null response body', { response: { status: 500, data: null } }],
    ['unstructured response body', { response: { status: 502, data: 'Bad Gateway' } }]
  ])('reports a %s without throwing from the rejection handler', async (_name, error) => {
    axios[method].mockRejectedValueOnce(error)
    const store = mockStore({ intl: { messages: {} } })

    await expect(store.dispatch(action())).resolves.toEqual({
      type: `${type}_ERROR`,
      completed: true,
      error
    })
    expect(store.getActions()).toEqual([
      { type: `${type}_REQUESTED`, completed: false },
      {
        type: 'ADD_NOTIFICATION',
        open: true,
        text: `issue.solution.dialog.${notification}.error`,
        severity: 'error',
        link: undefined
      },
      { type: `${type}_ERROR`, completed: true, error }
    ])
  })

  it('preserves the mapped server error', async () => {
    axios[method].mockRejectedValueOnce({ response: { data: { error: 'PULL_REQUEST_NOT_FOUND' } } })
    const store = mockStore({ intl: { messages: {} } })

    await expect(store.dispatch(action())).resolves.toEqual({
      type: `${type}_ERROR`,
      completed: true,
      error: 'PULL_REQUEST_NOT_FOUND'
    })
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'ADD_NOTIFICATION',
        text: 'issue.solution.dialog.pullRequest.notFound',
        severity: 'error'
      })
    )
  })
})
