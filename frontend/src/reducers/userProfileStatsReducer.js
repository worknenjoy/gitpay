import {
  GET_USER_PROFILE_STATS_REQUESTED,
  GET_USER_PROFILE_STATS_SUCCESS,
  GET_USER_PROFILE_STATS_ERROR
} from '../actions/userProfileStatsActions'

export const userProfileStats = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case GET_USER_PROFILE_STATS_REQUESTED:
      return { ...state, completed: false }
    case GET_USER_PROFILE_STATS_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case GET_USER_PROFILE_STATS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export default userProfileStats
