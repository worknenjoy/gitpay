import axios from 'axios'
import api from '../consts'

const LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED = 'PAYMENT_REQUEST_PAYMENT_REQUESTED'
const LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED = 'PAYMENT_REQUEST_PAYMENT_SUCCEEDED'
const LIST_PAYMENT_REQUEST_PAYMENT_FAILED = 'PAYMENT_REQUEST_PAYMENT_FAILED'

export const listPaymentRequestPaymentRequested = (data?: any) => ({
  type: LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
  payload: data
})

export const listPaymentRequestPaymentSucceeded = (data: any) => ({
  type: LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
  payload: data
})

export const listPaymentRequestPaymentFailed = (error: any) => ({
  type: LIST_PAYMENT_REQUEST_PAYMENT_FAILED,
  payload: error
})

export const listPaymentRequestPayments = () => async (dispatch: any) => {
  dispatch(listPaymentRequestPaymentRequested())

  try {
    const response = await axios.get(api.API_URL + '/payment-request-payments')
    if (response.data && (response.data as any).error) {
      dispatch(listPaymentRequestPaymentFailed(response.data.error))
    } else {
      dispatch(listPaymentRequestPaymentSucceeded(response.data))
    }
  } catch (error) {
    dispatch(listPaymentRequestPaymentFailed(error))
  }
}

export {
  LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED,
  LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
  LIST_PAYMENT_REQUEST_PAYMENT_FAILED
}
