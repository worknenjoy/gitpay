import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'

const FETCH_ORGANIZATIONS_REQUESTED = 'FETCH_ORGANIZATIONS_REQUESTED'
const FETCH_ORGANIZATIONS_SUCCESS = 'FETCH_ORGANIZATIONS_SUCCESS'
const FETCH_ORGANIZATIONS_ERROR = 'FETCH_ORGANIZATIONS_ERROR'

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
          // eslint-disable-next-line no-console
          console.log('fetch from organizations', response)
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

export {
  FETCH_ORGANIZATIONS_REQUESTED,
  FETCH_ORGANIZATIONS_SUCCESS,
  FETCH_ORGANIZATIONS_ERROR,
  fetchOrganizationsRequested,
  fetchOrganizationsSuccess,
  fetchOrganizationsError,
  fetchOrganizations
}
