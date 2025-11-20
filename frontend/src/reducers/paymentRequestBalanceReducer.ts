import {
  LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
  LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED,
  LIST_PAYMENT_REQUEST_BALANCE_FAILED,
} from '../actions/paymentRequestBalanceActions'

type PaymentRequestBalanceState = {
  completed: boolean
  error: unknown | null
  data: any
}

type Action<T = any> = {
  type: string
  payload?: T
}

const initialState: PaymentRequestBalanceState = {
  completed: false,
  error: null,
  data: null,
}

export const paymentRequestBalances = (
  state: PaymentRequestBalanceState = initialState,
  action: Action,
): PaymentRequestBalanceState => {
  switch (action.type) {
    case LIST_PAYMENT_REQUEST_BALANCE_REQUESTED:
      return {
        ...state,
        completed: true,
        error: null,
      }
    case LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED:
      return {
        ...state,
        completed: true,
        data: action.payload,
      }
    case LIST_PAYMENT_REQUEST_BALANCE_FAILED:
      return {
        ...state,
        completed: true,
        error: action.payload,
      }
    default:
      return state
  }
}
