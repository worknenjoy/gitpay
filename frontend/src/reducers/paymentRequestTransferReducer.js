import {
  LIST_PAYMENT_REQUEST_TRANSFER_REQUESTED,
  LIST_PAYMENT_REQUEST_TRANSFER_SUCCEEDED,
  LIST_PAYMENT_REQUEST_TRANSFER_FAILED,
} from '../actions/paymentRequestTransferActions'

const initialState = {
  completed: false,
  error: null,
  data: [],
}

export const paymentRequestTransfers = (state = initialState, action) => {
  switch (action.type) {
    case LIST_PAYMENT_REQUEST_TRANSFER_REQUESTED:
      return {
        ...state,
        completed: true,
        error: null,
      }
    case LIST_PAYMENT_REQUEST_TRANSFER_SUCCEEDED:
      return {
        ...state,
        completed: true,
        data: action.payload,
      }
    case LIST_PAYMENT_REQUEST_TRANSFER_FAILED:
      return {
        ...state,
        completed: true,
        error: action.payload,
      }
    default:
      return state
  }
}
