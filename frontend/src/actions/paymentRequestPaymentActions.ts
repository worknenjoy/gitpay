import axios from 'axios'
import api from '../consts'
import { addNotification } from './notificationActions'

export const LIST_PAYMENT_REQUEST_PAYMENT_REQUESTED = 'PAYMENT_REQUEST_PAYMENT_REQUESTED'
export const LIST_PAYMENT_REQUEST_PAYMENT_SUCCEEDED = 'PAYMENT_REQUEST_PAYMENT_SUCCEEDED'
export const LIST_PAYMENT_REQUEST_PAYMENT_FAILED = 'PAYMENT_REQUEST_PAYMENT_FAILED'

export const REFUND_PAYMENT_REQUEST_PAYMENT_REQUESTED = 'REFUND_PAYMENT_REQUEST_PAYMENT_REQUESTED'
export const REFUND_PAYMENT_REQUEST_PAYMENT_SUCCEEDED = 'REFUND_PAYMENT_REQUEST_PAYMENT_SUCCEEDED'
export const REFUND_PAYMENT_REQUEST_PAYMENT_FAILED = 'REFUND_PAYMENT_REQUEST_PAYMENT_FAILED'

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

export const refundPaymentRequestPaymentRequested = (data?: any) => ({
  type: REFUND_PAYMENT_REQUEST_PAYMENT_REQUESTED,
  payload: data
})

export const refundPaymentRequestPaymentSucceeded = (data: any) => ({
  type: REFUND_PAYMENT_REQUEST_PAYMENT_SUCCEEDED,
  payload: data
})

export const refundPaymentRequestPaymentFailed = (error: any) => ({
  type: REFUND_PAYMENT_REQUEST_PAYMENT_FAILED,
  payload: error
})

export const refundPaymentRequestPayment = (paymentId: number) => async (dispatch: any) => {
  dispatch(refundPaymentRequestPaymentRequested({ paymentId }))

  try {
    const response = await axios.post(`${api.API_URL}/payment-request-payments/${paymentId}/refund`)
    if (response.data && (response.data as any).error) {
      dispatch(
        addNotification('actions.paymentRequestPayment.refund.failed', { severity: 'error' })
      )
      return dispatch(refundPaymentRequestPaymentFailed(response.data.error))
    } else {
      dispatch(
        addNotification('actions.paymentRequestPayment.refund.success', { severity: 'success' })
      )
      return dispatch(refundPaymentRequestPaymentSucceeded(response.data))
    }
  } catch (error) {
    dispatch(addNotification('actions.paymentRequestPayment.refund.failed', { severity: 'error' }))
    return dispatch(refundPaymentRequestPaymentFailed(error))
  }
}
