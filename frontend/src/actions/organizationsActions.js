import axios from 'axios'
import api from '../consts'
import { loggedIn } from './loginActions'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const LIST_ORGANIZATIONS_REQUESTED = 'LIST_ORGANIZATIONS_REQUESTED'
const LIST_ORGANIZATIONS_SUCCESS = 'LIST_ORGANIZATIONS_SUCCESS'
const LIST_ORGANIZATIONS_ERROR = 'LIST_ORGANIZATIONS_ERROR'

const FETCH_ORGANIZATIONS_REQUESTED = 'FETCH_ORGANIZATIONS_REQUESTED'
const FETCH_ORGANIZATIONS_SUCCESS = 'FETCH_ORGANIZATIONS_SUCCESS'
const FETCH_ORGANIZATIONS_ERROR = 'FETCH_ORGANIZATIONS_ERROR'

const FETCH_ORGANIZATION_REQUESTED = 'FETCH_ORGANIZATION_REQUESTED'
const FETCH_ORGANIZATION_SUCCESS = 'FETCH_ORGANIZATION_SUCCESS'
const FETCH_ORGANIZATION_ERROR = 'FETCH_ORGANIZATION_ERROR'

const CREATE_ORGANIZATIONS_REQUESTED = 'CREATE_ORGANIZATIONS_REQUESTED'
const CREATE_ORGANIZATIONS_SUCCESS = 'CREATE_ORGANIZATIONS_SUCCESS'
const CREATE_ORGANIZATIONS_ERROR = 'CREATE_ORGANIZATIONS_ERROR'

const UPDATE_ORGANIZATIONS_REQUESTED = 'UPDATE_ORGANIZATIONS_REQUESTED'
const UPDATE_ORGANIZATIONS_SUCCESS = 'UPDATE_ORGANIZATIONS_SUCCESS'
const UPDATE_ORGANIZATIONS_ERROR = 'UPDATE_ORGANIZATIONS_ERROR'

const listOrganizationsRequested = () => {
  return { type: LIST_ORGANIZATIONS_REQUESTED, completed: false }
}

const listOrganizationsSuccess = (response) => {
  return { type: LIST_ORGANIZATIONS_SUCCESS, completed: true, data: response }
}

const listOrganizationsError = (error) => {
  return { type: LIST_ORGANIZATIONS_ERROR, completed: true, error }
}

const listOrganizations = () => {
  return (dispatch) => {
    dispatch(listOrganizationsRequested())
    axios
      .get(api.API_URL + '/organizations/list')
      .then((orgs) => {
        if (orgs.data) {
          return dispatch(listOrganizationsSuccess(orgs.data))
        }
        dispatch(addNotification('actions.orgs.list.error', { severity: 'error' }))
        return dispatch(listOrganizationsError({ message: 'actions.orgs.list.unavailable' }))
      })
      .catch((e) => {
        dispatch(addNotification('actions.orgs.list.other.error', { severity: 'error' }))
        dispatch(listOrganizationsError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

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
    return dispatch(loggedIn()).then((user) => {
      dispatch(fetchOrganizationsRequested())
      return axios
        .get(`${api.API_URL}/user/organizations`)
        .then((response) => {
          return dispatch(fetchOrganizationsSuccess(response.data))
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('error to fetch organizations', error)
          return dispatch(fetchOrganizationsError(error))
        })
    })
  }
}

const fetchOrganizationRequested = () => {
  return { type: FETCH_ORGANIZATION_REQUESTED, completed: false }
}

const fetchOrganizationSuccess = (data) => {
  return { type: FETCH_ORGANIZATION_SUCCESS, completed: true, data }
}

const fetchOrganizationError = (error) => {
  return { type: FETCH_ORGANIZATION_ERROR, completed: true, error }
}

const fetchOrganization = (id) => {
  validToken()
  return (dispatch) => {
    dispatch(fetchOrganizationRequested())
    return axios
      .get(`${api.API_URL}/organizations/fetch/${id}`)
      .then((response) => {
        return dispatch(fetchOrganizationSuccess(response.data))
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error to fetch organizations', error)
        return dispatch(fetchOrganizationError(error))
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
    return dispatch(loggedIn()).then((userResponse) => {
      dispatch(createOrganizationsRequested())
      return axios
        .post(`${api.API_URL}/organizations/create`, {
          name: org.name,
          UserId: userResponse.user.id
        })
        .then((response) => {
          dispatch(addNotification('actions.orgs.create.success'))
          return dispatch(createOrganizationsSuccess(response.data))
        })
        .catch((error) => {
          dispatch(addNotification('actions.orgs.create.error', { severity: 'error' }))
          // eslint-disable-next-line no-console
          console.log('error to fetch organizations', error)
          return dispatch(createOrganizationsError(error))
        })
    })
  }
}

const updateOrganizationsRequested = () => {
  return { type: UPDATE_ORGANIZATIONS_REQUESTED, completed: false }
}

const updateOrganizationsSuccess = (response) => {
  return { type: UPDATE_ORGANIZATIONS_SUCCESS, completed: true, organizations: response }
}

const updateOrganizationsError = (error) => {
  return { type: UPDATE_ORGANIZATIONS_ERROR, completed: true, error }
}

const updateOrganization = (organization) => {
  validToken()
  return (dispatch) => {
    return dispatch(loggedIn()).then((userResponse) => {
      dispatch(updateOrganizationsRequested())
      return axios
        .put(`${api.API_URL}/organizations/update`, organization)
        .then((response) => {
          dispatch(addNotification('actions.orgs.update.success'))
          return dispatch(updateOrganizationsSuccess(response.data))
        })
        .catch((error) => {
          dispatch(addNotification('actions.orgs.update.error', { severity: 'error' }))
          // eslint-disable-next-line no-console
          console.log('error to fetch organizations', error)
          return dispatch(updateOrganizationsError(error))
        })
    })
  }
}

export {
  LIST_ORGANIZATIONS_REQUESTED,
  LIST_ORGANIZATIONS_SUCCESS,
  LIST_ORGANIZATIONS_ERROR,
  listOrganizations,
  FETCH_ORGANIZATIONS_REQUESTED,
  FETCH_ORGANIZATIONS_SUCCESS,
  FETCH_ORGANIZATIONS_ERROR,
  fetchOrganizationsRequested,
  fetchOrganizationsSuccess,
  fetchOrganizationsError,
  fetchOrganizations,
  FETCH_ORGANIZATION_REQUESTED,
  FETCH_ORGANIZATION_SUCCESS,
  FETCH_ORGANIZATION_ERROR,
  fetchOrganizationRequested,
  fetchOrganizationSuccess,
  fetchOrganizationError,
  fetchOrganization,
  CREATE_ORGANIZATIONS_REQUESTED,
  CREATE_ORGANIZATIONS_SUCCESS,
  CREATE_ORGANIZATIONS_ERROR,
  createOrganizationsRequested,
  createOrganizationsSuccess,
  createOrganizationsError,
  createOrganizations,
  UPDATE_ORGANIZATIONS_REQUESTED,
  UPDATE_ORGANIZATIONS_SUCCESS,
  UPDATE_ORGANIZATIONS_ERROR,
  updateOrganization
}
