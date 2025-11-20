import {
  SEARCH_USER_REQUESTED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_ERROR,
} from '../actions/userActions'

export const user = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case SEARCH_USER_REQUESTED:
      return { ...state, completed: action.completed }
    case SEARCH_USER_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case SEARCH_USER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
