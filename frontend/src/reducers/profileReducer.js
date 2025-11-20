import {
  GET_USER_TYPES_REQUESTED,
  GET_USER_TYPES_SUCCESS,
  GET_USER_TYPES_ERROR,
} from '../actions/profileActions'

export const profileReducer = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case GET_USER_TYPES_REQUESTED:
      return { ...state, completed: false }
    case GET_USER_TYPES_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case GET_USER_TYPES_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export default profileReducer
