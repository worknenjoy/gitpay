import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'
import { logOut, fetchLoggedUser } from './loginActions'
import { validToken } from './helpers'
import convertParamsToStripeObject from './helpers/convert-params-to-stripe-object'

const FETCH_USER_ACCOUNT_REQUESTED = 'FETCH_USER_ACCOUNT_REQUESTED'
const FETCH_USER_ACCOUNT_SUCCESS = 'FETCH_USER_ACCOUNT_SUCCESS'
const FETCH_USER_ACCOUNT_ERROR = 'FETCH_USER_ACCOUNT_ERROR'

const FETCH_USER_BALANCE_REQUESTED = 'FETCH_USER_BALANCE_REQUESTED'
const FETCH_USER_BALANCE_SUCCESS = 'FETCH_USER_BALANCE_SUCCESS'
const FETCH_USER_BALANCE_ERROR = 'FETCH_USER_BALANCE_ERROR'

const FETCH_USER_ACCOUNT_COUNTRIES_REQUESTED = 'FETCH_USER_ACCOUNT_COUNTRIES_REQUESTED'
const FETCH_USER_ACCOUNT_COUNTRIES_SUCCESS = 'FETCH_USER_ACCOUNT_COUNTRIES_SUCCESS'
const FETCH_USER_ACCOUNT_COUNTRIES_ERROR = 'FETCH_USER_ACCOUNT_COUNTRIES_ERROR'

const CREATE_USER_ACCOUNT_REQUESTED = 'CREATE_USER_ACCOUNT'
const CREATE_USER_ACCOUNT_SUCCESS = 'CREATE_USER_ACCOUNT_SUCCESS'
const CREATE_USER_ACCOUNT_ERROR = 'CREATE_USER_ACCOUNT_ERROR'

const UPDATE_USER_ACCOUNT_REQUESTED = 'UPDATE_USER_ACCOUNT_REQUESTED'
const UPDATE_USER_ACCOUNT_SUCCESS = 'UPDATE_USER_ACCOUNT_SUCCESS'
const UPDATE_USER_ACCOUNT_ERROR = 'UPDATE_USER_ACCOUNT_ERROR'

const DELETE_USER_ACCOUNT_REQUESTED = 'DELETE_USER_ACCOUNT_REQUESTED'
const DELETE_USER_ACCOUNT_SUCCESS = 'DELETE_USER_ACCOUNT_SUCCESS'
const DELETE_USER_ACCOUNT_ERROR = 'DELETE_USER_ACCOUNT_ERROR'

const FETCH_USER_CUSTOMER_REQUESTED = 'FETCH_USER_CUSTOMER_REQUESTED'
const FETCH_USER_CUSTOMER_SUCCESS = 'FETCH_USER_CUSTOMER_SUCCESS'
const FETCH_USER_CUSTOMER_ERROR = 'FETCH_USER_CUSTOMER_ERROR'

const CREATE_USER_CUSTOMER_REQUESTED = 'CREATE_USER_CUSTOMER_REQUESTED'
const CREATE_USER_CUSTOMER_SUCCESS = 'CREATE_USER_CUSTOMER_SUCCESS'
const CREATE_USER_CUSTOMER_ERROR = 'CREATE_USER_CUSTOMER_ERROR'

const UPDATE_USER_CUSTOMER_REQUESTED = 'UPDATE_USER_CUSTOMER_REQUESTED'
const UPDATE_USER_CUSTOMER_SUCCESS = 'UPDATE_USER_CUSTOMER_SUCCESS'
const UPDATE_USER_CUSTOMER_ERROR = 'UPDATE_USER_CUSTOMER_ERROR'

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

const UPDATE_BANKACCOUNT_REQUESTED = 'UPDATE_BANKACCOUNT_REQUESTED'
const UPDATE_BANKACCOUNT_SUCCESS = 'UPDATE_BANKACCOUNT_SUCCESS'
const UPDATE_BANKACCOUNT_ERROR = 'UPDATE_BANKACCOUNT_ERROR'

const SEARCH_USER_REQUESTED = 'SEARCH_USER_REQUESTED'
const SEARCH_USER_SUCCESS = 'SEARCH_USER_SUCCESS'
const SEARCH_USER_ERROR = 'SEARCH_USER_ERROR'

/*
 * Account fetch
 */

const fetchUserAccountRequested = () => {
  return { type: FETCH_USER_ACCOUNT_REQUESTED, completed: false }
}

const fetchUserAccountSuccess = (account) => {
  return {
    type: FETCH_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const fetchUserAccountError = (error) => {
  return { type: FETCH_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account fetch balance
 */

const fetchUserBalanceRequested = () => {
  return { type: FETCH_USER_BALANCE_REQUESTED, completed: false }
}

const fetchUserBalanceSuccess = (balance) => {
  return {
    type: FETCH_USER_BALANCE_SUCCESS,
    completed: true,
    data: balance.data
  }
}

const fetchUserBalanceError = (error) => {
  return { type: FETCH_USER_BALANCE_ERROR, completed: true, error: error }
}

/*
 * Account fetch countries
 */

const fetchUserAccountCountriesRequested = () => {
  return { type: FETCH_USER_ACCOUNT_COUNTRIES_REQUESTED, completed: false }
}

const fetchUserAccountCountriesSuccess = (countries) => {
  return {
    type: FETCH_USER_ACCOUNT_COUNTRIES_SUCCESS,
    completed: true,
    data: countries.data
  }
}

const fetchUserAccountCountriesError = (error) => {
  return { type: FETCH_USER_ACCOUNT_COUNTRIES_ERROR, completed: true, error: error }
}

/*
 * Account create
 */

const createUserAccountRequested = () => {
  return { type: CREATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const createUserAccountSuccess = (account) => {
  return {
    type: CREATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createUserAccountError = (error) => {
  return { type: CREATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account update
 */

const updateUserAccountRequested = () => {
  return { type: UPDATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const updateUserAccountSuccess = (account) => {
  return {
    type: UPDATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const updateUserAccountError = (error, data) => {
  return { type: UPDATE_USER_ACCOUNT_ERROR, completed: true, error: error, data }
}

/*
 * User account delete
 */

const deleteUserAccountRequested = () => {
  return { type: DELETE_USER_ACCOUNT_REQUESTED, completed: false }
}

const deleteUserAccountSuccess = (user) => {
  return {
    type: DELETE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: user.data
  }
}

const deleteUserAccountError = (error) => {
  return { type: DELETE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * User customer fetch
 */

const fetchUserCustomerRequested = () => {
  return { type: FETCH_USER_CUSTOMER_REQUESTED, completed: false }
}

const fetchUserCustomerSuccess = (customer) => {
  return {
    type: FETCH_USER_CUSTOMER_SUCCESS,
    completed: true,
    data: customer.data
  }
}

const fetchUserCustomerError = (error) => {
  return { type: FETCH_USER_CUSTOMER_ERROR, completed: true, error: error }
}

/*
 * User customer create
 */

const createUserCustomerRequested = () => {
  return { type: CREATE_USER_CUSTOMER_REQUESTED, completed: false }
}

const createUserCustomerSuccess = (customer) => {
  return {
    type: CREATE_USER_CUSTOMER_SUCCESS,
    completed: true,
    data: customer.data
  }
}

const createUserCustomerError = (error) => {
  return { type: CREATE_USER_CUSTOMER_ERROR, completed: true, error: error }
}

/*
 * User customer update
 */

const updateUserCustomerRequested = () => {
  return { type: UPDATE_USER_CUSTOMER_REQUESTED, completed: false }
}

const updateUserCustomerSuccess = (customer) => {
  return {
    type: UPDATE_USER_CUSTOMER_SUCCESS,
    completed: true,
    data: customer.data
  }
}

const updateUserCustomerError = (error) => {
  return { type: UPDATE_USER_CUSTOMER_ERROR, completed: true, error: error }
}

/*
 * User update
 */

const updateUserRequested = () => {
  return { type: UPDATE_USER_REQUESTED, completed: false }
}

const updateUserSuccess = (user) => {
  return {
    type: UPDATE_USER_SUCCESS,
    completed: true,
    data: user.data
  }
}

const updateUserError = (error) => {
  return { type: UPDATE_USER_ERROR, completed: true, error: error }
}

/*
 * User activate
 */

const activateUserRequested = () => {
  return { type: ACTIVATE_USER_REQUESTED, completed: false }
}

const activateUserSuccess = (user) => {
  return {
    type: ACTIVATE_USER_SUCCESS,
    completed: true,
    data: user.data
  }
}

const activateUserError = (error) => {
  return { type: ACTIVATE_USER_ERROR, completed: true, error: error }
}

/*
 * User resend activation
 */

const resendActivationEmailRequested = () => {
  return { type: RESEND_ACTIVATION_EMAIL_REQUESTED, completed: false }
}

const resendActivationEmailSuccess = (user) => {
  return {
    type: RESEND_ACTIVATION_EMAIL_SUCCESS,
    completed: true,
    data: user.data
  }
}

const resendActivationEmailError = (error) => {
  return { type: RESEND_ACTIVATION_EMAIL_ERROR, completed: true, error: error }
}

/*
 * Account bank get
 */

const getBankAccountRequested = () => {
  return { type: GET_BANKACCOUNT_REQUESTED, completed: false }
}

const getBankAccountSuccess = (account) => {
  return { type: GET_BANKACCOUNT_SUCCESS, completed: true, data: account.data }
}

const getBankAccountError = (error) => {
  return { type: GET_BANKACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account bank create
 */

const createBankAccountRequested = () => {
  return { type: CREATE_BANKACCOUNT_REQUESTED, completed: false }
}

const createBankAccountSuccess = (account) => {
  return {
    type: CREATE_BANKACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createBankAccountError = (error, data) => {
  return { type: CREATE_BANKACCOUNT_ERROR, completed: true, error, data }
}

/*
 * Account bank update
 */

const updateBankAccountRequested = () => {
  return { type: UPDATE_BANKACCOUNT_REQUESTED, completed: false }
}

const updateBankAccountSuccess = (account) => {
  return {
    type: UPDATE_BANKACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const updateBankAccountError = (error, data) => {
  return { type: UPDATE_BANKACCOUNT_ERROR, completed: true, error, data }
}

const fetchCustomer = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchUserCustomerRequested())
    return axios
      .get(api.API_URL + '/user/customer')
      .then((customer) => {
        return dispatch(fetchUserCustomerSuccess(customer))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('fetch user customer error', e)
        return dispatch(fetchUserCustomerError(e))
      })
  }
}

const createCustomer = (customerData) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(createUserCustomerRequested())
    const customerId = getState().loggedIn.data.customer_id

    if (customerId) {
      dispatch(addNotification('actions.customer.exist'))
      return dispatch(createUserCustomerError({ message: 'actions.customer.exist' }))
    }
    axios
      .post(api.API_URL + '/user/customer', customerData)
      .then((customer) => {
        if (!customer.data) {
          dispatch(addNotification('actions.customer.create.error', { severity: 'error' }))
          return dispatch(createUserCustomerError({ message: 'actions.customer.create.error' }))
        }
        dispatch(addNotification('actions.customer.create.success'))
        return dispatch(createUserCustomerSuccess(customer))
      })
      .catch((error) => {
        dispatch(addNotification('actions.customer.create.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on create customer', error)
        return dispatch(createUserCustomerError(error))
      })
  }
}

const updateCustomer = (customerData) => {
  validToken()
  return (dispatch) => {
    dispatch(updateUserCustomerRequested())
    axios
      .put(api.API_URL + '/user/customer', customerData)
      .then((customer) => {
        dispatch(addNotification('actions.customer.update.success'))
        return dispatch(updateUserCustomerSuccess(customer))
      })
      .catch((error) => {
        const errorMessage = error.response.data
        dispatch(addNotification('actions.customer.update.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on update customer', error)
        return dispatch(updateUserCustomerError('actions.customer.update.error'))
      })
  }
}

/*
 * Connected Account
 */

const fetchAccount = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchUserAccountRequested())
    return axios
      .get(api.API_URL + '/user/account')
      .then((account) => {
        return dispatch(fetchUserAccountSuccess(account))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('fetch user account error', e)
        return dispatch(fetchUserAccountError(e))
      })
  }
}

const fetchAccountBalance = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchUserBalanceRequested())
    return axios
      .get(api.API_URL + '/user/account/balance')
      .then((balance) => {
        return dispatch(fetchUserBalanceSuccess(balance))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('fetch user account balance error', e)
        return dispatch(fetchUserBalanceError(e))
      })
  }
}

const fetchAccountCountries = () => {
  validToken()
  return (dispatch) => {
    dispatch(fetchUserAccountCountriesRequested())
    return axios
      .get(api.API_URL + '/user/account/countries')
      .then((countries) => {
        return dispatch(fetchUserAccountCountriesSuccess(countries))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('fetch user account countries error', e)
        return dispatch(fetchUserAccountCountriesError(e))
      })
  }
}

const createAccount = (country) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(createUserAccountRequested())
    const accountId = getState().loggedIn.data.account_id

    if (accountId) {
      dispatch(addNotification('actions.user.account.exist'))
      return dispatch(createUserAccountError({ message: 'actions.user.account.exist' }))
    }
    return axios
      .post(api.API_URL + '/user/account', { country })
      .then((account) => {
        if (!account.data) {
          dispatch(addNotification('actions.user.account.create.error', { severity: 'error' }))
          return dispatch(createUserAccountError({ message: 'actions.user.account.create.error' }))
        }
        dispatch(addNotification('actions.user.account.create.success'))
        dispatch(fetchLoggedUser())
        dispatch(fetchAccountCountries())
        return dispatch(createUserAccountSuccess(account))
      })
      .catch((error) => {
        dispatch(addNotification('actions.user.account.create.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createUserAccountError(error))
      })
  }
}

const updateAccount = (account) => {
  validToken()
  const accountData = convertParamsToStripeObject(account)
  const accountUpdateParams = { ...account }
  delete accountUpdateParams.country
  return (dispatch, getState) => {
    dispatch(updateUserAccountRequested())
    return axios
      .put(api.API_URL + '/user/account', accountUpdateParams)
      .then((account) => {
        dispatch(addNotification('actions.user.account.update.success'))
        return dispatch(updateUserAccountSuccess(account))
      })
      .catch((error) => {
        const errorData = error.response.data
        dispatch(
          addNotification('actions.user.account.update.error.missing', { severity: 'error' })
        )
        // eslint-disable-next-line no-console
        console.log('error on update account', error)

        return dispatch(updateUserAccountError(error.response.data, accountData))
      })
  }
}

const deleteAccount = () => {
  validToken()
  return (dispatch) => {
    dispatch(deleteUserAccountRequested())
    return axios
      .delete(api.API_URL + '/user/account')
      .then((user) => {
        dispatch(addNotification('actions.user.account.delete.success'))
        return dispatch(deleteUserAccountSuccess(user))
      })
      .catch((error) => {
        dispatch(addNotification('actions.user.account.delete.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on delete account', error)
        return dispatch(deleteUserAccountError(error))
      })
  }
}

/*
 * User
 */

const updateUser = (userData) => {
  validToken()
  return (dispatch) => {
    dispatch(updateUserRequested())
    return axios
      .put(api.API_URL + '/user', userData)
      .then((user) => {
        dispatch(addNotification('notifications.account.update'))
        dispatch(fetchLoggedUser())
        return dispatch(updateUserSuccess(user))
      })
      .catch((error) => {
        dispatch(addNotification('notifications.account.update.error', { severity: 'error' }))
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
      .then((user) => {
        dispatch(addNotification('notifications.account.activate'))
        // dispatch(fetchAccount());
        return dispatch(activateUserSuccess(user))
      })
      .catch((error) => {
        dispatch(addNotification('notifications.account.activate.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on activate user', error)
        return dispatch(activateUserError(error))
      })
  }
}

const resendActivationEmail = () => {
  validToken()
  return (dispatch) => {
    dispatch(resendActivationEmailRequested())
    return axios
      .get(api.API_URL + `/auth/resend-activation-email`)
      .then((user) => {
        dispatch(addNotification('notifications.account.resend_activation_email.success'))
        // dispatch(fetchAccount());
        return dispatch(resendActivationEmailSuccess(user))
      })
      .catch((error) => {
        dispatch(
          addNotification('notifications.account.resend_activation_email.error', {
            severity: 'error'
          })
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
    return axios
      .delete(api.API_URL + `/user/delete/`, {})
      .then((result) => {
        dispatch(addNotification('account.profile.settings.delete.user.notification'))
        dispatch(logOut())
        return result
      })
      .catch((error) => {
        dispatch(
          addNotification('account.profile.settings.delete.user.notification.error', {
            severity: 'error'
          })
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
      .then((bankAccount) => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('notifications.bank.get.success'))
          return dispatch(getBankAccountError(bankAccount.data))
        }
        return dispatch(getBankAccountSuccess(bankAccount))
      })
      .catch((error) => {
        dispatch(addNotification('notifications.bank.get.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(getBankAccountError(error))
      })
  }
}

const createBankAccount = (bank) => {
  validToken()
  return (dispatch) => {
    dispatch(createBankAccountRequested())
    return axios
      .post(api.API_URL + '/user/bank_accounts', {
        routing_number: bank.routing_number,
        account_number: bank.account_number,
        country: bank.country,
        account_holder_type: bank.account_holder_type,
        account_holder_name: bank.account_holder_name,
        currency: bank.currency
      })
      .then((bankAccount) => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('notifications.bank.create.other.error', { severity: 'error' }))
          return dispatch(createBankAccountError(bankAccount.data, bank))
        }
        dispatch(addNotification('notifications.bank.create.success'))

        return dispatch(createBankAccountSuccess(bankAccount))
      })
      .catch((error) => {
        dispatch(addNotification('notifications.bank.create.other.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createBankAccountError(error, bank))
      })
  }
}

const updateBankAccount = (bank_account) => {
  validToken()
  return (dispatch) => {
    dispatch(updateBankAccountRequested())
    return axios
      .put(api.API_URL + '/user/bank_accounts', bank_account)
      .then((bankAccount) => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('notifications.bank.update.error', { severity: 'error' }))
          return dispatch(updateBankAccountError(bankAccount.data))
        }
        dispatch(addNotification('notifications.bank.update.success'))

        return dispatch(updateBankAccountSuccess(bankAccount))
      })
      .catch((error) => {
        dispatch(addNotification('notifications.bank.update.other.error', { severity: 'error' }))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(updateBankAccountError(error, bank_account))
      })
  }
}

const searchUserRequested = () => {
  return { type: SEARCH_USER_REQUESTED, logged: false, completed: false }
}

const searchUserSuccess = (user) => {
  return { type: SEARCH_USER_SUCCESS, logged: false, completed: true, data: user }
}

const searchUserError = (error) => {
  return { type: SEARCH_USER_ERROR, logged: false, completed: true, error: error }
}

const searchUser = (data) => {
  return (dispatch) => {
    dispatch(searchUserRequested())
    return axios
      .get(api.API_URL + '/users', {
        params: data
      })
      .then((response) => {
        if (response?.data) {
          dispatch(searchUserSuccess(response.data[0]))
        } else {
          dispatch(addNotification('user.search.error', { severity: 'error' }))
        }
      })
      .catch((error) => {
        console.log('error', error)
        dispatch(addNotification('user.search.error', { severity: 'error' }))
        dispatch(searchUserError(error))
      })
  }
}

export {
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  FETCH_USER_BALANCE_REQUESTED,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_USER_ACCOUNT_COUNTRIES_REQUESTED,
  FETCH_USER_ACCOUNT_COUNTRIES_SUCCESS,
  FETCH_USER_ACCOUNT_COUNTRIES_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR,
  DELETE_USER_ACCOUNT_REQUESTED,
  DELETE_USER_ACCOUNT_SUCCESS,
  DELETE_USER_ACCOUNT_ERROR,
  FETCH_USER_CUSTOMER_REQUESTED,
  FETCH_USER_CUSTOMER_SUCCESS,
  FETCH_USER_CUSTOMER_ERROR,
  CREATE_USER_CUSTOMER_REQUESTED,
  CREATE_USER_CUSTOMER_SUCCESS,
  CREATE_USER_CUSTOMER_ERROR,
  UPDATE_USER_CUSTOMER_REQUESTED,
  UPDATE_USER_CUSTOMER_SUCCESS,
  UPDATE_USER_CUSTOMER_ERROR,
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
  UPDATE_BANKACCOUNT_REQUESTED,
  UPDATE_BANKACCOUNT_SUCCESS,
  UPDATE_BANKACCOUNT_ERROR,
  SEARCH_USER_REQUESTED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_ERROR,
  fetchAccount,
  fetchAccountBalance,
  fetchAccountCountries,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  updateUser,
  activateUser,
  resendActivationEmail,
  createBankAccount,
  updateBankAccount,
  getBankAccount,
  deleteUser,
  searchUser
}
