import axios from 'axios'
import api from '../consts'

const LIST_PAYMENT_REQUEST_BALANCE_REQUESTED = 'PAYMENT_REQUEST_BALANCE_REQUESTED'
const LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED = 'PAYMENT_REQUEST_BALANCE_SUCCEEDED'
const LIST_PAYMENT_REQUEST_BALANCE_FAILED = 'PAYMENT_REQUEST_BALANCE_FAILED'

export const listPaymentRequestBalanceRequested = (data?: any) => ({
  type: LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
  payload: data
})

export const listPaymentRequestBalanceSucceeded = (data: any) => ({
  type: LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED,
  payload: data
})

export const listPaymentRequestBalanceFailed = (error: any) => ({
  type: LIST_PAYMENT_REQUEST_BALANCE_FAILED,
  payload: error
})

export const listPaymentRequestBalances = () => async (dispatch: any) => {
  dispatch(listPaymentRequestBalanceRequested())

  try {
    const response = await axios.get(api.API_URL + '/payment-request-balances')
    if (response.data && (response.data as any).error) {
      dispatch(listPaymentRequestBalanceFailed(response.data.error))
    } else {
      dispatch(listPaymentRequestBalanceSucceeded(response.data))
    }
  } catch (error) {
    dispatch(listPaymentRequestBalanceFailed(error))
  }
}

export {
  LIST_PAYMENT_REQUEST_BALANCE_REQUESTED,
  LIST_PAYMENT_REQUEST_BALANCE_SUCCEEDED,
  LIST_PAYMENT_REQUEST_BALANCE_FAILED
}
