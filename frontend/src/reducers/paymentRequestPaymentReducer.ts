import {
  LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
  LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
  LIST_PAYMENT_REQUEST_PAYMENT_FAILED,
} from '../actions/paymentRequestPaymentActions'

type PaymentRequestPaymentState = {
  completed: boolean
  error: unknown | null
  data: any[]
}

type Action<T = any> = {
  type: string
  payload?: T
}

const initialState: PaymentRequestPaymentState = {
  completed: false,
  error: null,
  data: [],
}

export const paymentRequestPayments = (
  state: PaymentRequestPaymentState = initialState,
  action: Action,
): PaymentRequestPaymentState => {
  switch (action.type) {
    case LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED:
      return {
        ...state,
        completed: true,
        error: null,
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED:
      return {
        ...state,
        completed: true,
        data: action.payload,
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_FAILED:
      return {
        ...state,
        completed: true,
        error: action.payload,
      }
    default:
      return state
  }
}
