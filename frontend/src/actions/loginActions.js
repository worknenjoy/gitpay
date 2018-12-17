import api from '../consts'
import axios from 'axios'
import Auth from '../modules/auth'
import { addNotification } from './notificationActions'

export const LOGGED_IN_REQUESTED = 'LOGGED_IN_REQUESTED'
export const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS'
export const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR'

export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
export const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED'

export const REGISTER_USER_REQUESTED = 'REGISTER_USER_REQUESTED'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR'

/*
 *
 * Login
 *
 */

const loggedInRequested = () => {
  return { type: LOGGED_IN_REQUESTED, logged: false, completed: false }
}

const loggedInSuccess = user => {
  return { type: LOGGED_IN_SUCCESS, logged: true, completed: true, user: user }
}

const loggedInError = error => {
  return { type: LOGGED_IN_ERROR, logged: false, completed: true, error: error }
}

const loggedOutRequested = () => {
  return { type: LOGOUT_REQUESTED, logged: true, completed: false }
}

const loggedOutCompleted = () => {
  return { type: LOGOUT_COMPLETED, logged: false, completed: true }
}

export const loggedIn = () => {
  const token = Auth.getToken()
  if (token) {
    return dispatch => {
      dispatch(loggedInRequested())
      return axios
        .get(api.API_URL + '/authenticated', {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          if (!Auth.getAuthNotified()) {
            dispatch(addNotification('user.login.successfull'))
            Auth.authNotified()
          }
          return dispatch(loggedInSuccess(response.data.user))
        })
        .catch(error => {
          dispatch(
            addNotification('user.login.error')
          )
          return dispatch(loggedInError(error))
        })
    }
  }
  else {
    return dispatch => {
      return Promise.reject(dispatch(loggedInError({ error: 'not logged' })))
    }
  }
}

/*
 *
 * Register
 *
 */

const registerRequested = () => {
  return { type: REGISTER_USER_REQUESTED, logged: false, completed: false }
}

const registerSuccess = user => {
  return { type: REGISTER_USER_SUCCESS, logged: true, completed: true, user: user }
}

const registerError = error => {
  return { type: REGISTER_USER_ERROR, logged: false, completed: true, error: error }
}

export const registerUser = (data) => {
  return dispatch => {
    dispatch(registerRequested())
    return axios
      .post(api.API_URL + '/auth/register', data)
      .then(response => {
        if (response.data.email) {
          dispatch(addNotification('user.register.successfull'))
          return dispatch(registerSuccess(response.data))
        }
        dispatch(
          addNotification('user.register.error')
        )
        return dispatch(registerError({}))
      })
      .catch(error => {
        if (error.error === 'user.exist') {
          dispatch(
            addNotification('user.login.error')
          )
        }
        else {
          dispatch(
            addNotification('user.exist')
          )
        }
        return dispatch(registerError(error))
      })
  }
}

export const logOut = () => {
  Auth.deauthenticateUser()
  return (dispatch, getState) => {
    dispatch(loggedOutRequested())
    dispatch(addNotification('user.logout'))
    dispatch(loggedOutCompleted())
  }
}
