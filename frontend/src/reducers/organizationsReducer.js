import {
  LIST_ORGANIZATIONS_REQUESTED,
  LIST_ORGANIZATIONS_SUCCESS,
  LIST_ORGANIZATIONS_ERROR,
  FETCH_ORGANIZATIONS_REQUESTED,
  FETCH_ORGANIZATIONS_SUCCESS,
  FETCH_ORGANIZATIONS_ERROR,
  FETCH_ORGANIZATION_REQUESTED,
  FETCH_ORGANIZATION_SUCCESS,
  FETCH_ORGANIZATION_ERROR,
  CREATE_ORGANIZATIONS_REQUESTED,
  CREATE_ORGANIZATIONS_SUCCESS,
  CREATE_ORGANIZATIONS_ERROR,
  UPDATE_ORGANIZATIONS_REQUESTED,
  UPDATE_ORGANIZATIONS_SUCCESS,
  UPDATE_ORGANIZATIONS_ERROR,
} from '../actions/organizationsActions'

export const organizations = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case LIST_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case LIST_ORGANIZATIONS_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case LIST_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case FETCH_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ORGANIZATIONS_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case FETCH_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case CREATE_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_ORGANIZATIONS_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case CREATE_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case UPDATE_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case UPDATE_ORGANIZATIONS_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case UPDATE_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}

export const organization = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_ORGANIZATION_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ORGANIZATION_SUCCESS:
      return { ...state, data: action.data, completed: action.completed }
    case FETCH_ORGANIZATION_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
