import axios from 'axios'
import api from '../consts'

const LIST_PAYMENT_REQUEST_TRANSFER_REQUESTED = 'PAYMENT_REQUEST_TRANSFER_REQUESTED'
const LIST_PAYMENT_REQUEST_TRANSFER_SUCCEEDED = 'PAYMENT_REQUEST_TRANSFER_SUCCEEDED'
const LIST_PAYMENT_REQUEST_TRANSFER_FAILED = 'PAYMENT_REQUEST_TRANSFER_FAILED'

export const listPaymentRequestTransferRequested = (data) => ({
  type: LIST_PAYMENT_REQUEST_TRANSFER_REQUESTED,
  payload: data,
})

export const listPaymentRequestTransferSucceeded = (data) => ({
  type: LIST_PAYMENT_REQUEST_TRANSFER_SUCCEEDED,
  payload: data,
})

export const listPaymentRequestTransferFailed = (error) => ({
  type: LIST_PAYMENT_REQUEST_TRANSFER_FAILED,
  payload: error,
})

export const listPaymentRequestTransfers = (params) => (dispatch) => {
  dispatch(listPaymentRequestTransferRequested())

  return axios
    .get(api.API_URL + '/payment-request-transfers', { params })
    .then((response) => {
      if (response.data.error) {
        dispatch(listPaymentRequestTransferFailed(response.data.error))
      } else {
        dispatch(listPaymentRequestTransferSucceeded(response.data))
      }
    })
    .catch((error) => {
      dispatch(listPaymentRequestTransferFailed(error))
    })
}

export {
  LIST_PAYMENT_REQUEST_TRANSFER_REQUESTED,
  LIST_PAYMENT_REQUEST_TRANSFER_SUCCEEDED,
  LIST_PAYMENT_REQUEST_TRANSFER_FAILED,
}
