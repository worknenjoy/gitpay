import {
  FETCH_PROFILE_TYPES_REQUESTED,
  FETCH_PROFILE_TYPES_SUCCESS,
  FETCH_PROFILE_TYPES_ERROR
} from '../actions/userProfileTypeActions'

export const profileTypes = (state = { data: [], completed: false }, action) => {
  switch (action.type) {
    case FETCH_PROFILE_TYPES_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_PROFILE_TYPES_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case FETCH_PROFILE_TYPES_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
