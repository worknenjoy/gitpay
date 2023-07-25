import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'
import { logOut } from './loginActions'
import { validToken } from './helpers'

const FETCH_USER_ACCOUNT_REQUESTED = 'FETCH_USER_ACCOUNT_REQUESTED'
const FETCH_USER_ACCOUNT_SUCCESS = 'FETCH_USER_ACCOUNT_SUCCESS'
const FETCH_USER_ACCOUNT_ERROR = 'FETCH_USER_ACCOUNT_ERROR'

const CREATE_USER_ACCOUNT_REQUESTED = 'CREATE_USER_ACCOUNT'
const CREATE_USER_ACCOUNT_SUCCESS = 'CREATE_USER_ACCOUNT_SUCCESS'
const CREATE_USER_ACCOUNT_ERROR = 'CREATE_USER_ACCOUNT_ERROR'

const UPDATE_USER_ACCOUNT_REQUESTED = 'UPDATE_USER_ACCOUNT_REQUESTED'
const UPDATE_USER_ACCOUNT_SUCCESS = 'UPDATE_USER_ACCOUNT_SUCCESS'
const UPDATE_USER_ACCOUNT_ERROR = 'UPDATE_USER_ACCOUNT_ERROR'

const UPDATE_USER_REQUESTED = 'UPDATE_USER_REQUESTED'
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR'

const ACTIVATE_USER_REQUESTED = 'ACTIVATE_USER_REQUESTED'
const ACTIVATE_USER_SUCCESS = 'ACTIVATE_USER_SUCCESS'
const ACTIVATE_USER_ERROR = 'ACTIVATE_USER_ERROR'

const RESEND_ACTIVATION_EMAIL_REQUESTED = 'RESEND_ACTIVATION_EMAIL_REQUESTED'
const RESEND_ACTIVATION_EMAIL_SUCCESS = 'RESEND_ACTIVATION_EMAIL_SUCCESS'
const RESEND_ACTIVATION_EMAIL_ERROR = 'RESEND_ACTIVATION_EMAIL_ERROR'

const CREATE_BANKACCOUNT_REQUESTED = 'CREATE_BANKACCOUNT_REQUESTED'
const CREATE_BANKACCOUNT_SUCCESS = 'CREATE_BANKACCOUNT_SUCCESS'
const CREATE_BANKACCOUNT_ERROR = 'CREATE_BANKACCOUNT_ERROR'

const GET_BANKACCOUNT_REQUESTED = 'GET_BANKACCOUNT_REQUESTED'
const GET_BANKACCOUNT_SUCCESS = 'GET_BANKACCOUNT_SUCCESS'
const GET_BANKACCOUNT_ERROR = 'GET_BANKACCOUNT_ERROR'

/*
 * Account fetch
 */

const fetchUserAccountRequested = () => {
  return { type: FETCH_USER_ACCOUNT_REQUESTED, completed: false }
}

const fetchUserAccountSuccess = account => {
  return {
    type: FETCH_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const fetchUserAccountError = error => {
  return { type: FETCH_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account create
 */

const createUserAccountRequested = () => {
  return { type: CREATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const createUserAccountSuccess = account => {
  return {
    type: CREATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createUserAccountError = error => {
  return { type: CREATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account update
 */

const updateUserAccountRequested = () => {
  return { type: UPDATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const updateUserAccountSuccess = account => {
  return {
    type: UPDATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const updateUserAccountError = error => {
  return { type: UPDATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * User update
 */

const updateUserRequested = () => {
  return { type: UPDATE_USER_REQUESTED, completed: false }
}

const updateUserSuccess = user => {
  return {
    type: UPDATE_USER_SUCCESS,
    completed: true,
    data: user.data
  }
}

const updateUserError = error => {
  return { type: UPDATE_USER_ERROR, completed: true, error: error }
}

/*
  * User activate
*/

const activateUserRequested = () => {
  return { type: ACTIVATE_USER_REQUESTED, completed: false }
}

const activateUserSuccess = user => {
  return {
    type: ACTIVATE_USER_SUCCESS,
    completed: true,
    data: user.data
  }
}

const activateUserError = error => {
  return { type: ACTIVATE_USER_ERROR, completed: true, error: error }
}

/*
  * User resend activation
*/

const resendActivationEmailRequested = () => {
  return { type: RESEND_ACTIVATION_EMAIL_REQUESTED, completed: false }
}

const resendActivationEmailSuccess = user => {
  return {
    type: RESEND_ACTIVATION_EMAIL_SUCCESS,
    completed: true,
    data: user.data
  }
}

const resendActivationEmailError = error => {
  return { type: RESEND_ACTIVATION_EMAIL_ERROR, completed: true, error: error }
}

/*
 * Account bank get
 */

const getBankAccountRequested = () => {
  return { type: GET_BANKACCOUNT_REQUESTED, completed: false }
}

const getBankAccountSuccess = account => {
  return { type: GET_BANKACCOUNT_SUCCESS, completed: true, data: account.data }
}

const getBankAccountError = error => {
  return { type: GET_BANKACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account bank create
 */

const createBankAccountRequested = () => {
  return { type: CREATE_BANKACCOUNT_REQUESTED, completed: false }
}

const createBankAccountSuccess = account => {
  return {
    type: CREATE_BANKACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createBankAccountError = error => {
  return { type: CREATE_BANKACCOUNT_ERROR, completed: true, error: error }
}

const fetchAccount = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchUserAccountRequested())
    return axios
      .get(api.API_URL + '/user/account')
      .then(account => {
        return dispatch(fetchUserAccountSuccess(account))
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log('fetch user account error', e)
        return dispatch(fetchUserAccountError(e))
      })
  }
}

const createAccount = (country) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(createUserAccountRequested())
    const accountId = getState().loggedIn.user.account_id

    if (accountId) {
      dispatch(addNotification('actions.user.account.exist'))
      return dispatch(
        createUserAccountError({ message: 'actions.user.account.exist' })
      )
    }
    axios
      .post(api.API_URL + '/user/account', { country })
      .then(account => {
        dispatch(addNotification('actions.user.account.create.success'))
        return dispatch(createUserAccountSuccess(account))
      })
      .catch(error => {
        dispatch(addNotification('actions.user.account.create.error'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createUserAccountError(error))
      })
  }
}

const updateAccount = (_, accountData) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(updateUserAccountRequested())
    axios
      .put(api.API_URL + '/user/account', { account: accountData })
      .then(account => {
        dispatch(addNotification('actions.user.account.update.success'))
        // dispatch(fetchAccount());
        return dispatch(updateUserAccountSuccess(account))
      })
      .catch(error => {
        const errorMessage = error.response.data
        dispatch(
          addNotification(
            errorMessage ? `${errorMessage.message} ${errorMessage.param}` : 'actions.user.account.update.error.missing'
          )
        )
        // eslint-disable-next-line no-console
        console.log('error on update account', error)
        return dispatch(updateUserAccountError(error))
      })
  }
}

const updateUser = (_, userData) => {
  validToken()
  return (dispatch) => {
    dispatch(updateUserRequested())
    return axios
      .put(api.API_URL + '/user/update', userData)
      .then(user => {
        dispatch(addNotification('notifications.account.update'))
        // dispatch(fetchAccount());
        return dispatch(updateUserSuccess(user))
      })
      .catch(error => {
        dispatch(
          addNotification('notifications.account.update.error')
        )
        // eslint-disable-next-line no-console
        console.log('error on update user', error)
        return dispatch(updateUserError(error))
      })
  }
}

const activateUser = (userId, token) => {
  return (dispatch) => {
    dispatch(activateUserRequested())
    return axios
      .get(api.API_URL + `/auth/activate?token=${token}&userId=${userId}`, { userId, token })
      .then(user => {
        dispatch(addNotification('notifications.account.activate'))
        // dispatch(fetchAccount());
        return dispatch(activateUserSuccess(user))
      })
      .catch(error => {
        dispatch(
          addNotification('notifications.account.activate.error')
        )
        // eslint-disable-next-line no-console
        console.log('error on activate user', error)
        return dispatch(activateUserError(error))
      })
  }
}

const resendActivationEmail = (userId) => {
  return (dispatch) => {
    dispatch(resendActivationEmailRequested())
    return axios
      .get(api.API_URL + `/auth/resend-activation-email?userId=${userId}`, { userId })
      .then(user => {
        dispatch(addNotification('notifications.account.resend_activation_email.success'))
        // dispatch(fetchAccount());
        return dispatch(resendActivationEmailSuccess(user))
      })
      .catch(error => {
        dispatch(
          addNotification('notifications.account.resend_activation_email.error')
        )
        // eslint-disable-next-line no-console
        console.log('error on resend activation email', error)
        return dispatch(resendActivationEmailError(error))
      })
  }
}

const deleteUser = (user) => {
  validToken()
  return (dispatch) => {
    const id = user.id
    return axios
      .delete(api.API_URL + `/user/delete/${id}`, {})
      .then(result => {
        dispatch(addNotification('account.profile.settings.delete.user.notification'))
        dispatch(logOut())
        return result
      })
      .catch(error => {
        dispatch(
          addNotification('account.profile.settings.delete.user.notification.error')
        )
        // eslint-disable-next-line no-console
        console.log('error on delete account', error)
        return error
      })
  }
}

const getBankAccount = () => {
  validToken()
  return (dispatch) => {
    dispatch(getBankAccountRequested())
    axios
      .get(`${api.API_URL}/user/bank_accounts`)
      .then(bankAccount => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('notifications.bank.get.success'))
          return dispatch(getBankAccountError(bankAccount.data))
        }
        return dispatch(getBankAccountSuccess(bankAccount))
      })
      .catch(error => {
        dispatch(addNotification('notifications.bank.get.error'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(getBankAccountError(error))
      })
  }
}

const createBankAccount = (_, bank) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(createBankAccountRequested())
    axios
      .post(api.API_URL + '/user/bank_accounts', {
        routing_number: bank.routing_number,
        account_number: bank.account_number,
        country: bank.country
      })
      .then(bankAccount => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('notifications.bank.create.error'))
          return dispatch(createBankAccountError(bankAccount.data))
        }
        dispatch(addNotification('notifications.bank.create.success'))

        return dispatch(createBankAccountSuccess(bankAccount))
      })
      .catch(error => {
        dispatch(addNotification('notifications.bank.create.other.error'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createBankAccountError(error))
      })
  }
}

export {
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  ACTIVATE_USER_REQUESTED,
  ACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_ERROR,
  RESEND_ACTIVATION_EMAIL_REQUESTED,
  RESEND_ACTIVATION_EMAIL_SUCCESS,
  RESEND_ACTIVATION_EMAIL_ERROR,
  GET_BANKACCOUNT_REQUESTED,
  GET_BANKACCOUNT_SUCCESS,
  GET_BANKACCOUNT_ERROR,
  CREATE_BANKACCOUNT_REQUESTED,
  CREATE_BANKACCOUNT_SUCCESS,
  CREATE_BANKACCOUNT_ERROR,
  fetchAccount,
  createAccount,
  updateAccount,
  updateUser,
  activateUser,
  resendActivationEmail,
  createBankAccount,
  getBankAccount,
  deleteUser,
}
