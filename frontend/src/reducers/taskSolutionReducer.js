import {
  FETCH_PULL_REQUEST_DATA_REQUESTED,
  FETCH_PULL_REQUEST_DATA_SUCCESS,
  GET_TASK_SOLUTION_REQUESTED,
  GET_TASK_SOLUTION_SUCCESS,
  CREATE_TASK_SOLUTION_REQUESTED,
  CREATE_TASK_SOLUTION_SUCCESS,
  CLEAN_PULL_REQUEST_DATA_STATE,
  LIST_TASK_SOLUTIONS_REQUESTED,
  LIST_TASK_SOLUTIONS_SUCCESS,
  LIST_TASK_SOLUTIONS_ERROR
} from '../actions/taskSolutionActions'

const initialState = {
  taskSolution: {},
  pullRequestData: {},
  completed: false
}

export const taskSolutions = (state = { data: [], completed: false }, action) => {
  switch (action.type) {
    case LIST_TASK_SOLUTIONS_REQUESTED:
      return { ...state, completed: false }
    case LIST_TASK_SOLUTIONS_SUCCESS:
      return { ...state, completed: true, data: action.taskSolutions }
    case LIST_TASK_SOLUTIONS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const taskSolution = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PULL_REQUEST_DATA_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_PULL_REQUEST_DATA_SUCCESS:
      return { ...state, completed: action.completed, pullRequestData: action.pullRequestData }
    case GET_TASK_SOLUTION_REQUESTED:
      return { ...state, completed: action.completed }
    case GET_TASK_SOLUTION_SUCCESS:
      return { ...state, completed: action.completed, taskSolution: action.taskSolution }
    case CREATE_TASK_SOLUTION_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_TASK_SOLUTION_SUCCESS:
      return { ...state, completed: action.completed, taskSolution: action.taskSolution }
    case CLEAN_PULL_REQUEST_DATA_STATE:
      return { ...state, pullRequestData: {}, completed: true }
    default:
      return { ...state, completed: true }
  }
}

export default taskSolution
