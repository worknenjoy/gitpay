import {
  FETCH_ROLES_REQUESTED,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  UPDATE_ROLE_REQUESTED,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_ERROR
} from '../actions/roleActions'

export const roles = (state = { name: null, label: null, userId: null, id: null, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_ROLES_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_ROLES_SUCCESS:
      return { ...state, completed: action.completed, name: action.name, label: action.label, userId: action.userId, id: action.id }
    case FETCH_ROLES_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    case UPDATE_ROLE_REQUESTED:
      return { ...state, completed: action.completed }
    case UPDATE_ROLE_SUCCESS:
      return { ...state, completed: action.completed, name: action.name, label: action.label, userId: action.userId, id: action.id }
    case UPDATE_ROLE_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
