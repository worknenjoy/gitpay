import {
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
} from '../actions/loginActions'

import {
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from '../actions/userActions'

export const loggedIn = (state = { logged: false, user: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case LOGGED_IN_SUCCESS:
      return { ...state, logged: action.logged, user: action.user, completed: action.completed }
    case LOGGED_IN_ERROR:
      return { ...state, logged: action.logged, completed: action.completed, error: action.error }
    case LOGGED_IN_REQUESTED:
      return { ...state, logged: action.logged, completed: action.completed }
    case UPDATE_USER_REQUESTED:
      return { ...state, completed: action.completed }
    case UPDATE_USER_SUCCESS:
      return { ...state, user: action.data, completed: action.completed }
    case UPDATE_USER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case LOGOUT_REQUESTED:
    case LOGOUT_COMPLETED:
      return { ...state, logged: action.logged, completed: action.completed }
    default:
      return state
  }
}
