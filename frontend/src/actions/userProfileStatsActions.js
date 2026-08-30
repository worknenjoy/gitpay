import api from '../consts'
import axios from 'axios'

const GET_USER_PROFILE_STATS_REQUESTED = 'GET_USER_PROFILE_STATS_REQUESTED'
const GET_USER_PROFILE_STATS_SUCCESS = 'GET_USER_PROFILE_STATS_SUCCESS'
const GET_USER_PROFILE_STATS_ERROR = 'GET_USER_PROFILE_STATS_ERROR'

/*
  Fetch a user's public, role-scoped profile stats (contributor/maintainer/provider/funding)
*/

const getUserProfileStatsRequested = () => {
  return { type: GET_USER_PROFILE_STATS_REQUESTED, completed: false }
}

const getUserProfileStatsSuccess = (data) => {
  return { type: GET_USER_PROFILE_STATS_SUCCESS, completed: true, data }
}

const getUserProfileStatsError = (error) => {
  return { type: GET_USER_PROFILE_STATS_ERROR, completed: true, error: error }
}

const getUserProfileStats = (userId) => {
  return (dispatch) => {
    dispatch(getUserProfileStatsRequested())
    return axios
      .get(api.API_URL + `/users/${userId}/profile-stats`)
      .then((response) => {
        return dispatch(getUserProfileStatsSuccess(response.data))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('get user profile stats error', e)
        return dispatch(getUserProfileStatsError(e))
      })
  }
}

export {
  GET_USER_PROFILE_STATS_REQUESTED,
  GET_USER_PROFILE_STATS_SUCCESS,
  GET_USER_PROFILE_STATS_ERROR,
  getUserProfileStats
}
