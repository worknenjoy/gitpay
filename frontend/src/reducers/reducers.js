import { combineReducers } from 'redux'
import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED
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

const reducers = combineReducers({
  notification,
  loggedIn
})

export default reducers;


