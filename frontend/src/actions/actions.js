import api from '../consts';
import axios from 'axios';
import Auth from '../modules/auth';



const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

const ADD_DIALOG = 'ADD_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const LOGGED_IN_REQUESTED = 'LOGGED_IN_REQUESTED';
const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';
const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR';
const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED';

const FETCH_USER_ACCOUNT_REQUESTED = 'FETCH_USER_ACCOUNT_REQUESTED';
const FETCH_USER_ACCOUNT_SUCCESS = 'FETCH_USER_ACCOUNT_SUCCESS';
const FETCH_USER_ACCOUNT_ERROR = 'FETCH_USER_ACCOUNT_ERROR';

const CREATE_USER_ACCOUNT_REQUESTED = 'CREATE_USER_ACCOUNT';
const CREATE_USER_ACCOUNT_SUCCESS = 'CREATE_USER_ACCOUNT_SUCCESS';
const CREATE_USER_ACCOUNT_ERROR = 'CREATE_USER_ACCOUNT_ERROR';
const UPDATE_USER_ACCOUNT_REQUESTED = 'UPDATE_USER_ACCOUNT_REQUESTED';
const UPDATE_USER_ACCOUNT_SUCCESS = 'UPDATE_USER_ACCOUNT_SUCCESS';
const UPDATE_USER_ACCOUNT_ERROR = 'UPDATE_USER_ACCOUNT_ERROR';

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED';
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';


/*
*
* Notification
*
 */

const addNotification = (message) => {
  return { type: ADD_NOTIFICATION, text: message, open: true}
}

const closeNotification = () => {
  return { type: CLOSE_NOTIFICATION }
}

/*
 *
 * Dialog
 *
 */

const addDialog = () => {
  return { type: ADD_DIALOG, dialog: true}
}

const closeDialog = () => {
  return { type: CLOSE_DIALOG, dialog: false }
}

/*
 *
 * Login
 *
 */

const loggedInRequested = () => {
  return { type: LOGGED_IN_REQUESTED, logged: false, completed: false }
}

const loggedInSuccess = (user) => {
  return { type: LOGGED_IN_SUCCESS, logged: true, completed: true, user: user }
}

const loggedInError = (error) => {
  return { type: LOGGED_IN_ERROR, logged: false, completed: true, error: error }
}

/*
 *
 * Account
 *
 */

const fetchUserAccountRequested = () => {
  return { type: FETCH_USER_ACCOUNT_REQUESTED, completed: false }
}

const fetchUserAccountSuccess = (account) => {
  return { type: FETCH_USER_ACCOUNT_SUCCESS, completed: true, account: account }
}

const fetchUserAccountError = () => {
  return { type: FETCH_USER_ACCOUNT_ERROR, completed: true }
}

const createUserAccountRequested = () => {
  return { type: CREATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const createUserAccountSuccess = (account) => {
  return { type: CREATE_USER_ACCOUNT_SUCCESS, completed: true, account: account }
}

const createUserAccountError = (error) => {
  return { type: CREATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

const updateUserAccountRequested = () => {
  return { type: UPDATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const updateUserAccountSuccess = (account) => {
  return { type: UPDATE_USER_ACCOUNT_SUCCESS, completed: true, account: account }
}

const updateUserAccountError = (error) => {
  return { type: UPDATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 *
 * Task
 *
 */

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = (task) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, task: task }
}

const updateTaskError = (error) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, error: error }
}

const loggedIn = () => {
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

const fetchAccount = () => {
  return (dispatch, getState) => {
    dispatch(fetchUserAccountRequested());
    const userId = getState().loggedIn.user.id;
    if(!userId) {
      return dispatch(fetchUserAccountError({error: true, message: 'Not logged'}));
    }
    return axios.get(api.API_URL + `/users/${userId}/account`, {
      // headers would be here
    }).then((account) => {
      return dispatch(fetchUserAccountSuccess(account.data));
    }).catch((e) => {
      console.log('fetch user account error', e);
      return dispatch(fetchUserAccountError(e));
    });
  }
}

const createAccount = () => {
  return (dispatch, getState) => {
    dispatch(createUserAccountRequested());
    const userId = getState().loggedIn.user.id;
    const accountId = getState().loggedIn.user.account_id;
    if(accountId) {
      dispatch(addNotification('Já existe uma conta associada'));
      return dispatch(createUserAccountError({ message: 'Já existe uma conta associada' }));
    }
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(createUserAccountError({ message: 'Você precisa estar logado' }));
    }
    axios.post(api.API_URL + '/user/account', {
      id: userId
    }).then((account) => {
      dispatch(addNotification('Conta criada com sucesso'));
      return dispatch(createUserAccountSuccess(account));
    }).catch((error) => {
      dispatch(addNotification('Erro ao tentar criar uma conta'));
      console.log('error on create account', error);
      return dispatch(createUserAccountError(error));
    });
  }
};

const updateAccount = (accountData) => {
  return (dispatch, getState) => {
    dispatch(updateUserAccountRequested());
    const userId = getState().loggedIn.user.id;
    const accountId = getState().loggedIn.user.account_id;
    if(!accountId) {
      dispatch(addNotification('Você não possui uma conta associada'));
      return dispatch(createUserAccountError({ message: 'Você não possui uma conta' }));
    }
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(updateUserAccountError({ message: 'Você precisa estar logado' }));
    }
    axios.put(api.API_URL + `/user/account`, {
      id: userId,
      account: accountData
    }).then((account) => {
      dispatch(addNotification('Conta atualizada com sucesso'));
      dispatch(fetchAccount());
      return dispatch(updateUserAccountSuccess(account));
    }).catch((error) => {
      dispatch(addNotification('Erro ao tentar atualizar sua conta'));
      console.log('error on create account', error);
      return dispatch(updateUserAccountError(error));
    });
  }
};

const updateTask = (task) => {
  return (dispatch, getState) => {
    const userId = getState().loggedIn.user.id;
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(updateTaskError({ message: 'Você precisa estar logado' }));
    }
    axios.put(api.API_URL + '/tasks/update', task).then((response) => {
      dispatch(addNotification('Tarefa atualizada com sucesso'));
      return dispatch(updateTaskSuccess(response));
    }).catch((error) => {
      dispatch(addNotification('Erro ao atualizar tarefa'));
      return dispatch(updateTaskError(error));
    });
  }
}

export {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  ADD_DIALOG,
  CLOSE_DIALOG,
  LOGGED_IN_REQUESTED,
  LOGGED_IN_SUCCESS,
  LOGGED_IN_ERROR,
  LOGOUT_REQUESTED,
  LOGOUT_COMPLETED,
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR,
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  fetchAccount,
  createAccount,
  updateAccount,
  addNotification,
  closeNotification,
  addDialog,
  closeDialog,
  loggedIn,
  logOut,
  updateTask
};

