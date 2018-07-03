import {
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR,
  GET_BANKACCOUNT_REQUESTED,
  GET_BANKACCOUNT_SUCCESS,
  GET_BANKACCOUNT_ERROR,
  CREATE_BANKACCOUNT_REQUESTED,
  CREATE_BANKACCOUNT_SUCCESS,
  CREATE_BANKACCOUNT_ERROR,
} from '../actions/userActions'

export const account = (state = { data: { }, completed: true, error: {} }, action) => {
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
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const bankAccount = (state = { data: { }, completed: true, error: {} }, action) => {
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
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
