import {
  CREATE_WALLET_ORDER_REQUESTED,
  CREATE_WALLET_ORDER_SUCCESS,
  CREATE_WALLET_ORDER_ERROR,
  LIST_WALLET_ORDERS_REQUESTED,
  LIST_WALLET_ORDERS_SUCCESS,
  LIST_WALLET_ORDERS_ERROR,
  FETCH_WALLET_ORDER_REQUESTED,
  FETCH_WALLET_ORDER_SUCCESS,
  FETCH_WALLET_ORDER_ERROR,
} from '../actions/walletOrderActions'

export const walletOrder = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case CREATE_WALLET_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_WALLET_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.walletOrder }
    case CREATE_WALLET_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    case FETCH_WALLET_ORDER_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_WALLET_ORDER_SUCCESS:
      return { ...state, completed: action.completed, data: action.walletOrder }
    case FETCH_WALLET_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const walletOrders = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case LIST_WALLET_ORDERS_REQUESTED:
      return { ...state, completed: action.completed }
    case LIST_WALLET_ORDERS_SUCCESS:
      return { ...state, completed: action.completed, data: action.walletOrders }
    case LIST_WALLET_ORDERS_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
