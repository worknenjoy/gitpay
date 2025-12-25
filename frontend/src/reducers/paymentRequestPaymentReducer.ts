import {
  LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
  LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
  LIST_PAYMENT_REQUEST_PAYMENT_FAILED
} from '../actions/paymentRequestPaymentActions'

type PaymentRequestsPaymentState = {
  completed: boolean
  error: unknown | null
  data: any[]
}

type Action<T = any> = {
  type: string
  payload?: T
}

const initialPaymentRequestPaymentsState: PaymentRequestsPaymentState = {
  completed: false,
  error: null,
  data: []
}

export const paymentRequestPayments = (
  state: PaymentRequestsPaymentState = initialPaymentRequestPaymentsState,
  action: Action
): PaymentRequestsPaymentState => {
  switch (action.type) {
    case LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED:
      return {
        ...state,
        completed: true,
        error: null
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED:
      return {
        ...state,
        completed: true,
        data: action.payload
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_FAILED:
      return {
        ...state,
        completed: true,
        error: action.payload
      }
    default:
      return state
  }
}

type PaymentRequestPaymentState = {
  completed: boolean
  error: unknown | null
  data: any
}

const initialPaymentRequestPaymentState: PaymentRequestPaymentState = {
  completed: false,
  error: null,
  data: {}
}

export const paymentRequestPayment = (
  state: PaymentRequestPaymentState = initialPaymentRequestPaymentState,
  action: Action
): PaymentRequestPaymentState => {
  switch (action.type) {
    case LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED:
      return {
        ...state,
        completed: false,
        error: null
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED:
      return {
        ...state,
        completed: true,
        data: action.payload
      }
    case LIST_PAYMENT_REQUEST_PAYMENT_FAILED:
      return {
        ...state,
        completed: true,
        error: action.payload
      }
    default:
      return state
  }
}
