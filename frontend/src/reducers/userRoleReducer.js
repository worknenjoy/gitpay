import {
  FETCH_ROLES_REQUESTED,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
} from '../actions/userRoleActions'

export const roles = (state = { data: [], completed: false }, action) => {
  switch (action.type) {
    case FETCH_ROLES_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ROLES_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case FETCH_ROLES_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
