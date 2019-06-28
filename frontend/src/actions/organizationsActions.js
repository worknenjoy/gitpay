import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const FETCH_ORGANIZATIONS_REQUESTED = 'FETCH_ORGANIZATIONS_REQUESTED'
const FETCH_ORGANIZATIONS_SUCCESS = 'FETCH_ORGANIZATIONS_SUCCESS'
const FETCH_ORGANIZATIONS_ERROR = 'FETCH_ORGANIZATIONS_ERROR'

const CREATE_ORGANIZATIONS_REQUESTED = 'CREATE_ORGANIZATIONS_REQUESTED'
const CREATE_ORGANIZATIONS_SUCCESS = 'CREATE_ORGANIZATIONS_SUCCESS'
const CREATE_ORGANIZATIONS_ERROR = 'CREATE_ORGANIZATIONS_ERROR'

const fetchOrganizationsRequested = () => {
  return { type: FETCH_ORGANIZATIONS_REQUESTED, completed: false }
}

const fetchOrganizationsSuccess = (response) => {
  return { type: FETCH_ORGANIZATIONS_SUCCESS, completed: true, organizations: response }
}

const fetchOrganizationsError = (error) => {
  return { type: FETCH_ORGANIZATIONS_ERROR, completed: true, error }
}

const fetchOrganizations = () => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then(user => {
      dispatch(fetchOrganizationsRequested())
      return axios
        .get(`${api.API_URL}/user/organizations`)
        .then(response => {
          return dispatch(fetchOrganizationsSuccess(response.data))
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error to fetch organizations', error)
          return dispatch(fetchOrganizationsError(error))
        })
    })
  }
}

const createOrganizationsRequested = () => {
  return { type: CREATE_ORGANIZATIONS_REQUESTED, completed: false }
}

const createOrganizationsSuccess = (response) => {
  return { type: CREATE_ORGANIZATIONS_SUCCESS, completed: true, organizations: response }
}

const createOrganizationsError = (error) => {
  return { type: CREATE_ORGANIZATIONS_ERROR, completed: true, error }
}

const createOrganizations = (org) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then(userResponse => {
      dispatch(createOrganizationsRequested())
      return axios
        .post(`${api.API_URL}/organizations/create`, {
          name: org.name,
          UserId: userResponse.user.id
        })
        .then(response => {
          dispatch(addNotification('actions.orgs.create.success'))
          return dispatch(createOrganizationsSuccess(response.data))
        })
        .catch(error => {
          dispatch(addNotification('actions.orgs.create.error'))
          // eslint-disable-next-line no-console
          console.log('error to fetch organizations', error)
          return dispatch(createOrganizationsError(error))
        })
    })
  }
}

export {
  FETCH_ORGANIZATIONS_REQUESTED,
  FETCH_ORGANIZATIONS_SUCCESS,
  FETCH_ORGANIZATIONS_ERROR,
  fetchOrganizationsRequested,
  fetchOrganizationsSuccess,
  fetchOrganizationsError,
  fetchOrganizations,
  CREATE_ORGANIZATIONS_REQUESTED,
  CREATE_ORGANIZATIONS_SUCCESS,
  CREATE_ORGANIZATIONS_ERROR,
  createOrganizationsRequested,
  createOrganizationsSuccess,
  createOrganizationsError,
  createOrganizations
}
