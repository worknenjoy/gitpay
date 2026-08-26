import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const FETCH_PROFILE_TYPES_REQUESTED = 'FETCH_PROFILE_TYPES_REQUESTED'
const FETCH_PROFILE_TYPES_SUCCESS = 'FETCH_PROFILE_TYPES_SUCCESS'
const FETCH_PROFILE_TYPES_ERROR = 'FETCH_PROFILE_TYPES_ERROR'
const CREATE_PROFILE_TYPE_REQUESTED = 'CREATE_PROFILE_TYPE_REQUESTED'
const CREATE_PROFILE_TYPE_SUCCESS = 'CREATE_PROFILE_TYPE_SUCCESS'
const CREATE_PROFILE_TYPE_ERROR = 'CREATE_PROFILE_TYPE_ERROR'
const DELETE_PROFILE_TYPE_REQUESTED = 'DELETE_PROFILE_TYPE_REQUESTED'
const DELETE_PROFILE_TYPE_SUCCESS = 'DELETE_PROFILE_TYPE_SUCCESS'
const DELETE_PROFILE_TYPE_ERROR = 'DELETE_PROFILE_TYPE_ERROR'

const fetchProfileTypesRequested = () => {
  return { type: FETCH_PROFILE_TYPES_REQUESTED, completed: false }
}

const fetchProfileTypesSuccess = (data) => {
  return { type: FETCH_PROFILE_TYPES_SUCCESS, completed: true, data: data }
}

const fetchProfileTypesError = (error) => {
  return { type: FETCH_PROFILE_TYPES_ERROR, completed: true, error }
}

const createProfileTypeRequested = () => {
  return { type: CREATE_PROFILE_TYPE_REQUESTED, completed: false }
}

const createProfileTypeSuccess = (response) => {
  return {
    type: CREATE_PROFILE_TYPE_SUCCESS,
    completed: true,
    name: response.name,
    userId: response.userId,
    id: response.id
  }
}

const createProfileTypeError = (error) => {
  return { type: CREATE_PROFILE_TYPE_ERROR, completed: true, error: error }
}

const deleteProfileTypeRequested = () => {
  return { type: DELETE_PROFILE_TYPE_REQUESTED, completed: false }
}

const deleteProfileTypeSuccess = (response) => {
  return {
    type: DELETE_PROFILE_TYPE_SUCCESS,
    completed: true,
    name: response.name,
    userId: response.userId,
    id: response.id
  }
}

const deleteProfileTypeError = (error) => {
  return { type: DELETE_PROFILE_TYPE_ERROR, completed: true, error: error }
}

const fetchProfileTypes = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchProfileTypesRequested())
    return axios
      .get(`${api.API_URL}/types/search`)
      .then((response) => {
        return dispatch(fetchProfileTypesSuccess(response.data))
      })
      .catch((error) => {
        return dispatch(fetchProfileTypesError(error))
      })
  }
}

const createProfileTypes = (profileTypeData) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then((user) => {
      dispatch(createProfileTypeRequested())
      return axios
        .post(`${api.API_URL}/roles/create`, {
          name: profileTypeData.name
        })
        .then((resp) => {
          dispatch(addNotification('user.role.update.success'))
          return axios.get(`${api.API_URL}/roles/fetch`).then((response) => {
            return dispatch(fetchProfileTypesSuccess(response.data))
          })
        })
        .catch((error) => {
          return dispatch(createProfileTypeError(error))
        })
    })
  }
}

const deleteProfileTypes = (profileTypeData) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then((user) => {
      dispatch(deleteProfileTypeRequested())
      return axios
        .delete(`${api.API_URL}/roles/delete`, {
          data: { name: profileTypeData.name }
        })
        .then((response) => {
          dispatch(addNotification('user.role.update.success'))
          return axios.get(`${api.API_URL}/roles/fetch`).then((resp) => {
            return dispatch(fetchProfileTypesSuccess(resp.data))
          })
        })
        .catch((error) => {
          return dispatch(deleteProfileTypeError(error))
        })
    })
  }
}

export {
  FETCH_PROFILE_TYPES_REQUESTED,
  FETCH_PROFILE_TYPES_SUCCESS,
  FETCH_PROFILE_TYPES_ERROR,
  CREATE_PROFILE_TYPE_REQUESTED,
  CREATE_PROFILE_TYPE_SUCCESS,
  CREATE_PROFILE_TYPE_ERROR,
  DELETE_PROFILE_TYPE_REQUESTED,
  DELETE_PROFILE_TYPE_SUCCESS,
  DELETE_PROFILE_TYPE_ERROR,
  fetchProfileTypesRequested,
  fetchProfileTypesSuccess,
  fetchProfileTypesError,
  fetchProfileTypes,
  createProfileTypeRequested,
  createProfileTypeSuccess,
  createProfileTypeError,
  createProfileTypes,
  deleteProfileTypeRequested,
  deleteProfileTypeSuccess,
  deleteProfileTypeError,
  deleteProfileTypes
}
