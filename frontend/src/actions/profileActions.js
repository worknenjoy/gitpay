import api from '../consts'
import axios from 'axios'

const GET_USER_TYPES_REQUESTED = 'GET_USER_TYPES_REQUESTED'
const GET_USER_TYPES_SUCCESS = 'GET_USER_TYPES_SUCCESS'
const GET_USER_TYPES_ERROR = 'GET_USER_TYPES_ERROR'

/*
  Fetch user with types (roles)
*/

const getUserTypesRequested = () => {
  return { type: GET_USER_TYPES_REQUESTED, completed: false }
}

const getUserTypesSuccess = (user) => {
  return { type: GET_USER_TYPES_SUCCESS, completed: true, data: user.data }
}

const getUserTypesError = (error) => {
  return { type: GET_USER_TYPES_ERROR, completed: true, error: error }
}

const getUserTypes = (userId) => {
  return (dispatch) => {
    dispatch(getUserTypesRequested())
    return axios
      .get(api.API_URL + `/users/types/${userId}`)
      .then((user) => {
        return dispatch(getUserTypesSuccess(user))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('get user types error', e)
        return dispatch(getUserTypesError(e))
      })
  }
}

export { GET_USER_TYPES_REQUESTED, GET_USER_TYPES_SUCCESS, GET_USER_TYPES_ERROR, getUserTypes }
