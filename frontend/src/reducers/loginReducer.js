import {
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED
} from '../actions/loginActions'

export const loggedIn = (state = { logged: false, user: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case LOGGED_IN_SUCCESS:
      return { ...state, logged: action.logged, user: action.user, completed: action.completed }
    case LOGGED_IN_ERROR:
      return { ...state, logged: action.logged, completed: action.completed, error: action.error }
    case LOGGED_IN_REQUESTED:
      return { ...state, logged: action.logged, completed: action.completed }
    case LOGOUT_REQUESTED:
    case LOGOUT_COMPLETED:
      return { ...state, logged: action.logged, completed: action.completed }
    default:
      return state
  }
}
