import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'

const FETCH_ROLES_REQUESTED = 'FETCH_ROLES_REQUESTED'
const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS'
const FETCH_ROLES_ERROR = 'FETCH_ROLES_ERROR'

const fetchRolesRequested = () => {
  return { type: FETCH_ROLES_REQUESTED, completed: false }
}

const fetchRolesSuccess = (response) => {
  return { type: FETCH_ROLES_SUCCESS, completed: true, roles: response.roles }
  // return { type: FETCH_ROLES_SUCCESS, completed: true, language: response.language, os: response.os, languages: response.languages, skills: response.skills, receiveNotifications: response.receiveNotifications, openForJobs: response.openForJobs }
}

const fetchRolesError = (error) => {
  return { type: FETCH_ROLES_ERROR, completed: true, error }
}

const fetchRoles = () => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then(user => {
      dispatch(fetchRolesRequested())
      return axios
        .get(`${api.API_URL}/user/roles`)
        .then(response => {
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
  fetchRolesRequested,
  fetchRolesSuccess,
  fetchRolesError,
  fetchRoles
}
