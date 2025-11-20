import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const FETCH_ROLES_REQUESTED = 'FETCH_ROLES_REQUESTED'
const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS'
const FETCH_ROLES_ERROR = 'FETCH_ROLES_ERROR'
const CREATE_ROLE_REQUESTED = 'CREATE_ROLE_REQUESTED'
const CREATE_ROLE_SUCCESS = 'CREATE_ROLE_SUCCESS'
const CREATE_ROLE_ERROR = 'CREATE_ROLE_ERROR'
const DELETE_ROLE_REQUESTED = 'DELETE_ROLE_REQUESTED'
const DELETE_ROLE_SUCCESS = 'DELETE_ROLE_SUCCESS'
const DELETE_ROLE_ERROR = 'DELETE_ROLE_ERROR'

const fetchRolesRequested = () => {
  return { type: FETCH_ROLES_REQUESTED, completed: false }
}

const fetchRolesSuccess = (data) => {
  return { type: FETCH_ROLES_SUCCESS, completed: true, data: data }
}

const fetchRolesError = (error) => {
  return { type: FETCH_ROLES_ERROR, completed: true, error }
}

const createRoleRequested = () => {
  return { type: CREATE_ROLE_REQUESTED, completed: false }
}

const createRoleSuccess = (response) => {
  return {
    type: CREATE_ROLE_SUCCESS,
    completed: true,
    name: response.name,
    userId: response.userId,
    id: response.id,
  }
}

const createRoleError = (error) => {
  return { type: CREATE_ROLE_ERROR, completed: true, error: error }
}

const deleteRoleRequested = () => {
  return { type: DELETE_ROLE_REQUESTED, completed: false }
}

const deleteRoleSuccess = (response) => {
  return {
    type: DELETE_ROLE_SUCCESS,
    completed: true,
    name: response.name,
    userId: response.userId,
    id: response.id,
  }
}

const deleteRoleError = (error) => {
  return { type: DELETE_ROLE_ERROR, completed: true, error: error }
}

const fetchRoles = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchRolesRequested())
    return axios
      .get(`${api.API_URL}/types/search`)
      .then((response) => {
        return dispatch(fetchRolesSuccess(response.data))
      })
      .catch((error) => {
        return dispatch(fetchRolesError(error))
      })
  }
}

const createRoles = (rolesData) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then((user) => {
      dispatch(createRoleRequested())
      return (
        axios
          .post(`${api.API_URL}/roles/create`, {
            name: rolesData.name,
          })
          .then((resp) => {
            // dispatch(addNotification('user.role.update.success'))
            dispatch(addNotification('Role Updated Successfully'))
            // return dispatch(createRoleSuccess(response.data))
            return axios.get(`${api.API_URL}/roles/fetch`).then((response) => {
              return dispatch(fetchRolesSuccess(response.data))
            })
          })
          // })
          .catch((error) => {
            return dispatch(createRoleError(error))
          })
      )
    })
  }
}

const deleteRoles = (rolesData) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then((user) => {
      dispatch(deleteRoleRequested())
      return axios
        .delete(`${api.API_URL}/roles/delete`, {
          data: { name: rolesData.name },
        })
        .then((response) => {
          // dispatch(addNotification('user.role.update.success'))
          dispatch(addNotification('Role Updated Successfully'))
          // return dispatch(deleteRoleSuccess(response.data))
          return axios.get(`${api.API_URL}/roles/fetch`).then((resp) => {
            return dispatch(fetchRolesSuccess(resp.data))
          })
        })
        .catch((error) => {
          return dispatch(deleteRoleError(error))
        })
    })
  }
}

export {
  FETCH_ROLES_REQUESTED,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  CREATE_ROLE_REQUESTED,
  CREATE_ROLE_SUCCESS,
  CREATE_ROLE_ERROR,
  DELETE_ROLE_REQUESTED,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_ERROR,
  fetchRolesRequested,
  fetchRolesSuccess,
  fetchRolesError,
  fetchRoles,
  createRoleRequested,
  createRoleSuccess,
  createRoleError,
  createRoles,
  deleteRoleRequested,
  deleteRoleSuccess,
  deleteRoleError,
  deleteRoles,
}
