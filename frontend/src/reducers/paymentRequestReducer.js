import {
  CREATE_PAYMENT_REQUEST_REQUESTED,
  CREATE_PAYMENT_REQUEST_SUCCESS,
  CREATE_PAYMENT_REQUEST_ERROR,
  LIST_PAYMENT_REQUESTS_REQUESTED,
  LIST_PAYMENT_REQUESTS_SUCCESS,
  LIST_PAYMENT_REQUESTS_ERROR,
  UPDATE_PAYMENT_REQUEST_REQUESTED,
  UPDATE_PAYMENT_REQUEST_SUCCESS,
  UPDATE_PAYMENT_REQUEST_ERROR,
} from '../actions/paymentRequestActions'

export const paymentRequest = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case CREATE_PAYMENT_REQUEST_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_PAYMENT_REQUEST_SUCCESS:
      return { ...state, completed: action.completed, data: action.paymentRequest }
    case CREATE_PAYMENT_REQUEST_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case UPDATE_PAYMENT_REQUEST_REQUESTED:
      return { ...state, completed: action.completed }
    case UPDATE_PAYMENT_REQUEST_SUCCESS:
      return { ...state, completed: action.completed, data: action.paymentRequest }
    case UPDATE_PAYMENT_REQUEST_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const paymentRequests = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case LIST_PAYMENT_REQUESTS_REQUESTED:
      return { ...state, completed: action.completed }
    case LIST_PAYMENT_REQUESTS_SUCCESS:
      return { ...state, completed: action.completed, data: action.paymentRequests }
    case LIST_PAYMENT_REQUESTS_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
