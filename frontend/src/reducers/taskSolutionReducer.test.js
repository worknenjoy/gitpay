import { publicTaskSolutions } from './taskSolutionReducer'
import {
  LIST_PUBLIC_TASK_SOLUTIONS_REQUESTED,
  LIST_PUBLIC_TASK_SOLUTIONS_SUCCESS,
  LIST_PUBLIC_TASK_SOLUTIONS_ERROR
} from '../actions/taskSolutionActions'

describe('publicTaskSolutions reducer', () => {
  it('returns the initial state', () => {
    expect(publicTaskSolutions(undefined, {})).toEqual({ data: [], completed: false })
  })

  it('marks completed false on REQUESTED', () => {
    const state = publicTaskSolutions(
      { data: [{ id: 1 }], completed: true },
      { type: LIST_PUBLIC_TASK_SOLUTIONS_REQUESTED }
    )
    expect(state.completed).toBe(false)
  })

  it('stores the fetched data on SUCCESS', () => {
    const taskSolutions = [{ id: 1, pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1' }]
    const state = publicTaskSolutions(
      { data: [], completed: false },
      { type: LIST_PUBLIC_TASK_SOLUTIONS_SUCCESS, completed: true, taskSolutions }
    )
    expect(state).toEqual({ data: taskSolutions, completed: true })
  })

  it('stores the error on ERROR', () => {
    const error = new Error('boom')
    const state = publicTaskSolutions(
      { data: [], completed: false },
      { type: LIST_PUBLIC_TASK_SOLUTIONS_ERROR, completed: true, error }
    )
    expect(state).toEqual({ data: [], completed: true, error })
  })
})
