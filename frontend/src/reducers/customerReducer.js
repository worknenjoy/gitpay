import {
  FETCH_USER_CUSTOMER_REQUESTED,
  FETCH_USER_CUSTOMER_SUCCESS,
  FETCH_USER_CUSTOMER_ERROR,
  CREATE_USER_CUSTOMER_REQUESTED,
  CREATE_USER_CUSTOMER_SUCCESS,
  CREATE_USER_CUSTOMER_ERROR,
  UPDATE_USER_CUSTOMER_REQUESTED,
  UPDATE_USER_CUSTOMER_SUCCESS,
  UPDATE_USER_CUSTOMER_ERROR
} from '../actions/userActions'

export const customer = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_USER_CUSTOMER_REQUESTED:
      return { ...state, completed: false }
    case FETCH_USER_CUSTOMER_ERROR:
      return { ...state, completed: true, error: action.error }
    case FETCH_USER_CUSTOMER_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case CREATE_USER_CUSTOMER_REQUESTED:
      return { ...state, completed: false }
    case CREATE_USER_CUSTOMER_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case CREATE_USER_CUSTOMER_ERROR:
      return { ...state, completed: true, error: action.error }
    case UPDATE_USER_CUSTOMER_REQUESTED:
      return { ...state, completed: false }
    case UPDATE_USER_CUSTOMER_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case UPDATE_USER_CUSTOMER_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
