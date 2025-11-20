import {
  FETCH_PROJECT_REQUESTED,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ERROR,
  LIST_PROJECTS_REQUESTED,
  LIST_PROJECTS_SUCCESS,
  LIST_PROJECTS_ERROR,
} from '../actions/projectActions'

export const project = (
  state = {
    completed: true,
    data: {},
  },
  action,
) => {
  switch (action.type) {
    case FETCH_PROJECT_REQUESTED:
      return { ...state, completed: false }
    case FETCH_PROJECT_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case FETCH_PROJECT_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const projects = (
  state = {
    completed: true,
    data: [],
  },
  action,
) => {
  switch (action.type) {
    case LIST_PROJECTS_REQUESTED:
      return { ...state, completed: false }
    case LIST_PROJECTS_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case LIST_PROJECTS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
