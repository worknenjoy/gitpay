import {
  LIST_ORDERS_REQUESTED,
  LIST_ORDERS_SUCCESS,
  LIST_ORDERS_ERROR,
  CREATE_ORDER_REQUESTED,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  PAY_ORDER_REQUESTED,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_ERROR,
  TRANSFER_ORDER_REQUESTED,
  TRANSFER_ORDER_SUCCESS,
  TRANSFER_ORDER_ERROR,
  CANCEL_ORDER_REQUESTED,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_ERROR,
  DETAILS_ORDER_REQUESTED,
  DETAILS_ORDER_SUCCESS,
  DETAILS_ORDER_ERROR,
  REFUND_ORDER_REQUESTED,
  REFUND_ORDER_SUCCESS,
  REFUND_ORDER_ERROR
} from '../actions/orderActions'

export const order = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case CREATE_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case PAY_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case PAY_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case PAY_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case TRANSFER_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case TRANSFER_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.order }
    case TRANSFER_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case CANCEL_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case CANCEL_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.order }
    case CANCEL_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case DETAILS_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case DETAILS_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case DETAILS_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case REFUND_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case REFUND_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.order }
    case REFUND_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const orders = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case LIST_ORDERS_REQUESTED:
      return { ...state, completed: action.completed }
    case LIST_ORDERS_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case LIST_ORDERS_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
