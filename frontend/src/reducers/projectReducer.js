import {
  FETCH_PROJECT_REQUESTED,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ERROR
} from '../actions/projectActions'

export const project = (state = {
  completed: true,
  data: {}
}, action) => {
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
