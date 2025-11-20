import {
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
  GET_BANKACCOUNT_REQUESTED,
  GET_BANKACCOUNT_SUCCESS,
  GET_BANKACCOUNT_ERROR,
  UPDATE_BANKACCOUNT_REQUESTED,
  UPDATE_BANKACCOUNT_SUCCESS,
  UPDATE_BANKACCOUNT_ERROR,
  CREATE_BANKACCOUNT_REQUESTED,
  CREATE_BANKACCOUNT_SUCCESS,
  CREATE_BANKACCOUNT_ERROR
} from '../actions/userActions'

export const account = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case FETCH_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error }
    case FETCH_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case CREATE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case CREATE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case CREATE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error }
    case UPDATE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case UPDATE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case UPDATE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error, data: action.data }
    case DELETE_USER_ACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case DELETE_USER_ACCOUNT_SUCCESS:
      return { ...state, completed: true, data: {}, error: {} }
    case DELETE_USER_ACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const countries = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_USER_ACCOUNT_COUNTRIES_REQUESTED:
      return { ...state, completed: false }
    case FETCH_USER_ACCOUNT_COUNTRIES_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case FETCH_USER_ACCOUNT_COUNTRIES_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const balance = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_USER_BALANCE_REQUESTED:
      return { ...state, completed: false }
    case FETCH_USER_BALANCE_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case FETCH_USER_BALANCE_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const bankAccount = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case GET_BANKACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case GET_BANKACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case GET_BANKACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error }
    case CREATE_BANKACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case CREATE_BANKACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case CREATE_BANKACCOUNT_ERROR:
      return { ...state, completed: true, data: action.data, error: action.error }
    case UPDATE_BANKACCOUNT_REQUESTED:
      return { ...state, completed: false }
    case UPDATE_BANKACCOUNT_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case UPDATE_BANKACCOUNT_ERROR:
      return { ...state, completed: true, error: action.error, data: action.data }
    default:
      return state
  }
}
