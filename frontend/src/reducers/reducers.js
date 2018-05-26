import { combineReducers } from 'redux'
import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR
} from '../actions/actions'

const notification = (state = {open: false}, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return { ...state, text: action.text, open: true };
    case CLOSE_NOTIFICATION:
      return { ...state, open: false }
    default:
      return state;
  }
};

const loggedIn = (state = {logged: false, user: {}, completed: true}, action) => {
  switch (action.type) {
    case LOGGED_IN_SUCCESS:
      return { ...state, logged:  action.logged, user: action.user, completed: action.completed};
    case LOGGED_IN_ERROR:
      return { ...state, logged: action.logged, completed: action.completed};
    case LOGGED_IN_REQUESTED:
      return { ...state, logged: action.logged, completed: action.completed};
    case LOGOUT_REQUESTED:
    case LOGOUT_COMPLETED:
      return { ...state, logged: action.logged, completed: action.completed};
    default:
      return state;
  }
};

const account = (state = {account: {}, completed: true, error: {}}, action) => {
  switch (action.type) {
    case FETCH_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false };
    case FETCH_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error };
    case FETCH_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, account: action.account };
    case CREATE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false };
    case CREATE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, account: action.account };
    case CREATE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error };
    case UPDATE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false };
    case UPDATE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, account: action.account };
    case UPDATE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error };
    default:
      return state;
  }
}


const reducers = combineReducers({
  notification,
  loggedIn,
  account
})

export default reducers;


