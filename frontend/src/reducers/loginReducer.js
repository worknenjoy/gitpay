import {
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
  FETCH_LOGGED_USER_REQUESTED,
  FETCH_LOGGED_USER_SUCCESS,
  FETCH_LOGGED_USER_ERROR
} from '../actions/loginActions'

import {
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  DELETE_USER_ACCOUNT_REQUESTED,
  DELETE_USER_ACCOUNT_SUCCESS,
  DELETE_USER_ACCOUNT_ERROR
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
      return { ...state, logged: action.logged, completed: action.completed }
    case LOGOUT_COMPLETED:
      return { ...state, logged: action.logged, completed: action.completed }
    case FETCH_LOGGED_USER_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_LOGGED_USER_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case FETCH_LOGGED_USER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case DELETE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case DELETE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case DELETE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error }

    default:
      return state
  }
}
