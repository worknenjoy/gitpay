import { combineReducers } from 'redux'
import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION
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

const reducers = combineReducers({
  notification
})

export default reducers;


