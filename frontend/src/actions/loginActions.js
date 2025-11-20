import api from '../consts'
import axios from 'axios'
import Auth from '../modules/auth'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

export const LOGGED_IN_REQUESTED = 'LOGGED_IN_REQUESTED'
export const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS'
export const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR'

export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
export const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED'

export const REGISTER_USER_REQUESTED = 'REGISTER_USER_REQUESTED'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR'

export const AUTHORIZED_GITHUB_REQUESTED = 'AUTHORIZED_GITHUB_REQUESTED'
export const AUTHORIZED_GITHUB_SUCCESS = 'AUTHORIZED_GITHUB_SUCCESS'
export const AUTHORIZED_GITHUB_ERROR = 'AUTHORIZED_GITHUB_ERROR'

export const DISCONNECT_GITHUB_REQUESTED = 'DISCONNECT_GITHUB_REQUESTED'
export const DISCONNECT_GITHUB_SUCCESS = 'DISCONNECT_GITHUB_SUCCESS'
export const DISCONNECT_GITHUB_ERROR = 'DISCONNECT_GITHUB_ERROR'

export const FETCH_LOGGED_USER_REQUESTED = 'FETCH_LOGGED_IN_USER_REQUESTED'
export const FETCH_LOGGED_USER_SUCCESS = 'FETCH_LOGGED_IN_USER_SUCCESS'
export const FETCH_LOGGED_USER_ERROR = 'FETCH_LOGGED_IN_USER_ERROR'

/*
 *
 * Github authorize
 *
 */

const authorizedGithubRequested = () => {
  return { type: AUTHORIZED_GITHUB_REQUESTED, logged: false, completed: false }
}

const authorizedGithubSuccess = (user) => {
  return { type: AUTHORIZED_GITHUB_SUCCESS, logged: false, completed: true, user: user }
}

const authorizedGithubError = (error) => {
  return { type: AUTHORIZED_GITHUB_ERROR, logged: false, completed: true, error: error }
}

/*
 * Github disconnect
 */

const disconnectGithubRequested = () => {
  return { type: DISCONNECT_GITHUB_REQUESTED, logged: false, completed: false }
}

const disconnectGithubSuccess = (user) => {
  return { type: DISCONNECT_GITHUB_SUCCESS, logged: false, completed: true, user: user }
}

const disconnectGithubError = (error) => {
  return { type: DISCONNECT_GITHUB_ERROR, logged: false, completed: true, error: error }
}

/*
 *
 * Login
 *
 */

const loggedInRequested = () => {
  return { type: LOGGED_IN_REQUESTED, logged: false, completed: false }
}

const loggedInSuccess = (data) => {
  return { type: LOGGED_IN_SUCCESS, logged: true, completed: true, data }
}

const loggedInError = (error) => {
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
    return (dispatch, getState) => {
      dispatch(loggedInRequested())
      return axios
        .get(api.API_URL + '/authenticated', {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (!Auth.getAuthNotified()) {
            dispatch(addNotification('user.login.successfull'))
            Auth.authNotified()
          }

          if (window.localStorage.getItem('firstLogin') !== 'false') {
            window.localStorage.setItem('firstLogin', true)
          }
          return dispatch(loggedInSuccess(response.data.user))
        })
        .catch((error) => {
          dispatch(addNotification('user.login.error'))
          return dispatch(loggedInError(error))
        })
    }
  } else {
    return (dispatch) => {
      return Promise.resolve(dispatch(loggedInError({ error: 'not logged' })))
    }
  }
}

/*
 *
 * Fetch logged in user
 *
 */

export const fetchLoggedUserRequested = () => {
  return { type: FETCH_LOGGED_USER_REQUESTED, completed: false }
}

export const fetchLoggedUserSuccess = (data) => {
  return { type: FETCH_LOGGED_USER_SUCCESS, completed: true, data }
}

export const fetchLoggedUserError = (error) => {
  return { type: FETCH_LOGGED_USER_ERROR, completed: true, error: error }
}
export const fetchLoggedUser = () => {
  validToken()
  return (dispatch, getState) => {
    dispatch(fetchLoggedUserRequested())
    return axios
      .get(api.API_URL + '/user')
      .then((response) => {
        if (response.data) {
          return dispatch(fetchLoggedUserSuccess(response.data))
        }
        return dispatch(fetchLoggedUserError({}))
      })
      .catch((error) => {
        const errorCode = error.response.data.error
        dispatch(addNotification(errorCode || 'user.fetch.error'))
        return dispatch(fetchLoggedUserError(error))
      })
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

const registerSuccess = (user) => {
  return {
    type: REGISTER_USER_SUCCESS,
    logged: true,
    completed: true,
    user: user
  }
}

const registerError = (error) => {
  return {
    type: REGISTER_USER_ERROR,
    logged: false,
    completed: true,
    error: error
  }
}

export const registerUser = (data) => {
  return (dispatch) => {
    dispatch(registerRequested())
    return axios
      .post(api.API_URL + '/auth/register', data)
      .then((response) => {
        if (response.data.email.length) {
          dispatch(addNotification('user.register.successfull'))
          return dispatch(registerSuccess(response.data))
        }
        dispatch(addNotification('user.register.error'))
        return dispatch(registerError({}))
      })
      .catch((error) => {
        const responseError = error.response.data.message
        if (responseError !== 'user.exist') {
          dispatch(addNotification('user.login.error'))
        } else {
          dispatch(addNotification('user.exist'))
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

export const forgotPassword = (data) => {
  return (dispatch) => {
    return axios
      .post(api.API_URL + '/auth/forgot-password', data)
      .then((response) => {
        if (response) {
          return dispatch(addNotification('user.forgot.password.successfull'))
        } else {
          return dispatch(addNotification('user.forgot.password.error'))
        }
      })
      .catch((error) => {
        dispatch(addNotification('user.forgot.password.error'))
      })
  }
}

export const resetPassword = (data) => {
  return (dispatch) => {
    return axios
      .put(api.API_URL + '/auth/reset-password', data)
      .then((response) => {
        if (response) {
          dispatch(addNotification('user.reset.password.successfull'))
        } else {
          dispatch(addNotification('user.reset.password.error'))
        }
      })
      .catch((error) => {
        dispatch(addNotification('user.reset.password.error'))
      })
  }
}

export const changePassword = (data) => {
  return (dispatch) => {
    return axios
      .put(api.API_URL + '/auth/change-password', data)
      .then((response) => {
        if (response.data) {
          dispatch(addNotification('user.change.password.successfull'))
          logOut()
          window.setTimeout(() => {
            window.location.href = '/#/signin'
          }, 2000)
        } else {
          dispatch(addNotification(response.error.message || 'user.change.password.error'))
        }
      })
      .catch((error) => {
        const errorCode = error.response.data.error
        dispatch(addNotification(errorCode || 'user.change.password.error'))
      })
  }
}

export const authorizeGithub = () => {
  return (dispatch) => {
    dispatch(authorizedGithubRequested())
    window.location.href = `${api.API_URL}/connect/github/?token=${Auth.getToken()}`
  }
}

export const disconnectGithub = () => {
  return (dispatch) => {
    dispatch(disconnectGithubRequested())
    window.location.href = `${api.API_URL}/authorize/github/disconnect/?token=${Auth.getToken()}`
  }
}
