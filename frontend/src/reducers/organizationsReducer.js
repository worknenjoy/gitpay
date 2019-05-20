import {
    FETCH_ORGANIZATIONS_REQUESTED,
    FETCH_ORGANIZATIONS_SUCCESS,
    FETCH_ORGANIZATIONS_ERROR
  } from '../actions/organizationsActions'
  
  export const organizations = (state = { name: null, completed: true, error: {} }, action) => {
    switch (action.type) {
      case FETCH_ORGANIZATIONS_REQUESTED:
        return { ...state, completed: action.completed }
      case FETCH_ORGANIZATIONS_SUCCESS:
        return { ...state, name: action.name, completed: action.completed }
      case FETCH_ORGANIZATIONS_ERROR:
        return { ...state, error: action.error, completed: action.completed }
      default:
        return state
    }
  }
  