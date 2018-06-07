import api from '../consts';
import axios from 'axios';
import Auth from '../modules/auth';
import { addNotification } from './notificationActions';

export const LOGGED_IN_REQUESTED = 'LOGGED_IN_REQUESTED';
export const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';
export const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR';
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED';

/*
 *
 * Login
 *
 */

const loggedInRequested = () => {
  return {type: LOGGED_IN_REQUESTED, logged: false, completed: false}
}

const loggedInSuccess = (user) => {
  return {type: LOGGED_IN_SUCCESS, logged: true, completed: true, user: user}
}

const loggedInError = (error) => {
  return {type: LOGGED_IN_ERROR, logged: false, completed: true, error: error}
}

const loggedOutRequested = () => {
  return {type: LOGOUT_REQUESTED, logged: true, completed: false}
}

const loggedOutCompleted = () => {
  return {type: LOGOUT_COMPLETED, logged: false, completed: true}
}

export const loggedIn = () => {
  const token = Auth.getToken();
  if (token) {
    return (dispatch) => {
      dispatch(loggedInRequested());
      return axios.get(api.API_URL + '/authenticated', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (!Auth.getAuthNotified()) {
            dispatch(addNotification("Você logou na sua conta com sucesso"))
            Auth.authNotified();
          }
          return dispatch(loggedInSuccess(response.data.user));
        })
        .catch((error) => {
          console.log(error);
          dispatch(addNotification("Tivemos um problema ao tentar logar na sua conta"))
          return dispatch(loggedInError(error));
        });
    }
  }
  return loggedInError();
}

export const logOut = () => {
  Auth.deauthenticateUser();
  return (dispatch) => {
    dispatch(loggedOutRequested());
    dispatch(addNotification("Você acabou de sair da sua conta"));
    dispatch(loggedOutCompleted());
  }
}
