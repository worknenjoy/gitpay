import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'

const FETCH_ROLES_REQUESTED = 'FETCH_ROLES_REQUESTED'
const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS'
const FETCH_ROLES_ERROR = 'FETCH_ROLES_ERROR'
const UPDATE_ROLE_REQUESTED = 'UPDATE_ROLE_REQUESTED'
const UPDATE_ROLE_SUCCESS = 'UPDATE_ROLE_SUCCESS'
const UPDATE_ROLE_ERROR = 'UPDATE_ROLE_ERROR'

const fetchRolesRequested = () => {
  return { type: FETCH_ROLES_REQUESTED, completed: false }
}

const fetchRolesSuccess = (response) => {
  return { type: FETCH_ROLES_SUCCESS, completed: true, name: response.name, label: response.label, userId: response.userId, id: response.id }
  // return { type: FETCH_ROLES_SUCCESS, completed: true, language: response.language, os: response.os, languages: response.languages, skills: response.skills, receiveNotifications: response.receiveNotifications, openForJobs: response.openForJobs }
}

const fetchRolesError = (error) => {
  return { type: FETCH_ROLES_ERROR, completed: true, error }
}

const updateRoleRequested = () => {
  return { type: UPDATE_ROLE_REQUESTED, completed: false }
}

const updateRoleSuccess = (response) => {
  return {
    type: UPDATE_ROLE_SUCCESS, completed: true, name: response.name, label: response.label, userId: response.userId, id: response.id }
}

const updateRoleError = (error) => {
  return { type: UPDATE_ROLE_ERROR, completed: true, error: error }
}

const fetchRoles = () => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then(user => {
      dispatch(fetchRolesRequested())
      return axios
        .get(`${api.API_URL}/roles/fetch`)
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data)
          return dispatch(fetchRolesSuccess(response.data))
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          return dispatch(fetchRolesError(error))
        })
    })
  }
}

const updateRoles = (rolesData) => {
  // console.log(rolesData)
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then(user => {
      dispatch(updateRoleRequested())
      return axios
        .put(`${api.API_URL}/roles/update`, {
          name: rolesData.name
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response)
          return dispatch(fetchRolesSuccess(response.data))
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          return dispatch(fetchRolesError(error))
        })
    })
  }
}


export {
  FETCH_ROLES_REQUESTED,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  UPDATE_ROLE_REQUESTED,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_ERROR,
  fetchRolesRequested,
  fetchRolesSuccess,
  fetchRolesError,
  fetchRoles,
  updateRoleRequested,
  updateRoleSuccess,
  updateRoleError,
  updateRoles
}
