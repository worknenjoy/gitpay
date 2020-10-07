import {
  FETCH_ROLES_REQUESTED,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  CREATE_ROLE_REQUESTED,
  CREATE_ROLE_SUCCESS,
  CREATE_ROLE_ERROR,
  DELETE_ROLE_REQUESTED,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_ERROR
} from '../actions/userRoleActions'

export const roles = (state = { name: [], userId: [], id: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_ROLES_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ROLES_SUCCESS:
      return { ...state, completed: action.completed, name: action.name, userId: action.userId, id: action.id }
    case FETCH_ROLES_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case CREATE_ROLE_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_ROLE_SUCCESS:
      return { ...state, completed: action.completed, name: action.name, userId: action.userId, id: action.id }
    case CREATE_ROLE_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case DELETE_ROLE_REQUESTED:
      return { ...state, completed: action.completed }
    case DELETE_ROLE_SUCCESS:
      return { ...state, completed: action.completed, name: action.name, userId: action.userId, id: action.id }
    case DELETE_ROLE_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
