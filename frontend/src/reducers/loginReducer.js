import {
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_ERROR
} from '../actions/loginActions'

import {
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from '../actions/userActions'

export const loggedIn = (state = { logged: false, data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case LOGGED_IN_SUCCESS:
      return { ...state, logged: action.logged, data: action.data, completed: action.completed }
    case LOGGED_IN_ERROR:
      return { ...state, logged: action.logged, completed: action.completed, error: action.error }
    case LOGGED_IN_REQUESTED:
      return { ...state, logged: action.logged, completed: action.completed }
    case UPDATE_USER_REQUESTED:
      return { ...state, completed: action.completed }
    case UPDATE_USER_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case UPDATE_USER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case LOGOUT_REQUESTED:
    case LOGOUT_COMPLETED:
      return { ...state, logged: action.logged, completed: action.completed }
    case SEARCH_USER_SUCCESS:
      return { ...state, user: action.data }
    case SEARCH_USER_ERROR:
      return { ...state, error: action.error }
    default:
      return state
  }
}
