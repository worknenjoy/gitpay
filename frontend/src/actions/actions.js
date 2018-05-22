import api from '../consts';
import axios from 'axios';
import Auth from '../modules/auth';

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

const LOGGED_IN_REQUESTED = 'LOGGED_IN_REQUESTED';
const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';
const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR';
const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED';

const addNotification = (message) => {
  return { type: ADD_NOTIFICATION, text: message, open: true}
}

const closeNotification = () => {
  return { type: CLOSE_NOTIFICATION }
}

const loggedInRequested = () => {
  return { type: LOGGED_IN_REQUESTED, logged: false, completed: false }
}

const loggedInSuccess = (user) => {
  return { type: LOGGED_IN_SUCCESS, logged: true, completed: true, user: user }
}

const loggedInError = () => {
  return { type: LOGGED_IN_ERROR, logged: false, completed: true }
}

const loggedIn = () => {
  const token = Auth.getToken();
  if (token) {
    return (dispatch) => {
      dispatch(loggedInRequested());
      axios.get(api.API_URL + '/authenticated', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          console.log('response user check log', response);
          if (!Auth.getAuthNotified()) {
            dispatch(addNotification("Você logou na sua conta com sucesso"))
            Auth.authNotified();
          }
          dispatch(loggedInSuccess(response.data.user));
        })
        .catch((error) => {
          console.log(error);
          return dispatch(loggedInError());
        });
    }
  }
  return loggedInError();
}

const loggedOutRequested = () => {
  return { type: LOGOUT_REQUESTED, logged: true, completed: false }
}

const loggedOutCompleted = () => {
  return { type: LOGOUT_COMPLETED, logged: false, completed: true }
}

const logOut = () => {
  Auth.deauthenticateUser();
  return (dispatch) => {
    dispatch(loggedOutRequested());
    dispatch(addNotification("Você acabou de sair da sua conta"));
    dispatch(loggedOutCompleted());
  }
}

export {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
  addNotification,
  closeNotification,
  loggedIn,
  logOut
};

