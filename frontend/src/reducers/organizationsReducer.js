import {
  FETCH_ORGANIZATIONS_REQUESTED,
  FETCH_ORGANIZATIONS_SUCCESS,
  FETCH_ORGANIZATIONS_ERROR,
  CREATE_ORGANIZATIONS_REQUESTED,
  CREATE_ORGANIZATIONS_SUCCESS,
  CREATE_ORGANIZATIONS_ERROR
} from '../actions/organizationsActions'

export const organizations = (state = { organizations: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ORGANIZATIONS_SUCCESS:
      return { ...state, organizations: action.organizations, completed: action.completed }
    case FETCH_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case CREATE_ORGANIZATIONS_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_ORGANIZATIONS_SUCCESS:
      return { ...state, organizations: action.organizations, completed: action.completed }
    case CREATE_ORGANIZATIONS_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
