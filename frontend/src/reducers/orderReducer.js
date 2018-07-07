import {
  CREATE_ORDER_REQUESTED,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  PAY_ORDER_REQUESTED,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_ERROR
} from '../actions/orderActions'

export const order = (state = { data: {}, order: {}, completed: true, error: {} }, action) => {
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
      return { ...state, completed: action.completed, order: action.order }
    case PAY_ORDER_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
