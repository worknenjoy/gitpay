import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const CREATE_PAYMENT_REQUEST_REQUESTED = 'CREATE_PAYMENT_REQUEST_REQUESTED'
const CREATE_PAYMENT_REQUEST_SUCCESS = 'CREATE_PAYMENT_REQUEST_SUCCESS'
const CREATE_PAYMENT_REQUEST_ERROR = 'CREATE_PAYMENT_REQUEST_ERROR'

const LIST_PAYMENT_REQUESTS_REQUESTED = 'LIST_PAYMENT_REQUESTS_REQUESTED'
const LIST_PAYMENT_REQUESTS_SUCCESS = 'LIST_PAYMENT_REQUESTS_SUCCESS'
const LIST_PAYMENT_REQUESTS_ERROR = 'LIST_PAYMENT_REQUESTS_ERROR'

const UPDATE_PAYMENT_REQUEST_REQUESTED = 'UPDATE_PAYMENT_REQUEST_REQUESTED'
const UPDATE_PAYMENT_REQUEST_SUCCESS = 'UPDATE_PAYMENT_REQUEST_SUCCESS'
const UPDATE_PAYMENT_REQUEST_ERROR = 'UPDATE_PAYMENT_REQUEST_ERROR'

export const createPaymentRequestRequested = () => {
  return { type: CREATE_PAYMENT_REQUEST_REQUESTED }
}

export const createPaymentRequestSuccess = (paymentRequest) => {
  return { type: CREATE_PAYMENT_REQUEST_SUCCESS, paymentRequest }
}

export const createPaymentRequestError = (error) => {
  return { type: CREATE_PAYMENT_REQUEST_ERROR, error }
}

export const createPaymentRequest = (paymentRequest) => {
  validToken()
  return (dispatch) => {
    dispatch(createPaymentRequestRequested())
    return axios
      .post(api.API_URL + '/payment-requests', paymentRequest)
      .then((response) => {
        console.log(response)
        if (response.data) {
          dispatch(addNotification('actions.paymentRequest.create.success'))
          return dispatch(createPaymentRequestSuccess(response.data))
        }
        addNotification('actions.paymentRequest.create.error')
        return dispatch(createPaymentRequestError('actions.paymentRequest.create.error'))
      })
      .catch((e) => {
        dispatch(addNotification('actions.paymentRequest.create.error'))
        return dispatch(createPaymentRequestError(e))
      })
  }
}

export const listPaymentRequestsRequested = () => {
  return { type: LIST_PAYMENT_REQUESTS_REQUESTED, completed: false }
}

export const listPaymentRequestsSuccess = (paymentRequests) => {
  return { type: LIST_PAYMENT_REQUESTS_SUCCESS, completed: true, paymentRequests }
}

export const listPaymentRequestsError = (error) => {
  return { type: LIST_PAYMENT_REQUESTS_ERROR, completed: true, error }
}

export const listPaymentRequests = (params) => {
  validToken()
  return (dispatch) => {
    dispatch(listPaymentRequestsRequested())
    return axios
      .get(api.API_URL + '/payment-requests', { params })
      .then((response) => {
        if (response.data) {
          return dispatch(listPaymentRequestsSuccess(response.data))
        }
        return dispatch(listPaymentRequestsError('actions.paymentRequest.list.error'))
      })
      .catch((e) => {
        return dispatch(listPaymentRequestsError(e))
      })
  }
}

export const updatePaymentRequestRequested = () => {
  return { type: UPDATE_PAYMENT_REQUEST_REQUESTED }
}

export const updatePaymentRequestSuccess = (paymentRequest) => {
  return { type: UPDATE_PAYMENT_REQUEST_SUCCESS, paymentRequest }
}

export const updatePaymentRequestError = (error) => {
  return { type: UPDATE_PAYMENT_REQUEST_ERROR, error }
}

export const updatePaymentRequest = (paymentRequest) => {
  validToken()
  return (dispatch) => {
    dispatch(updatePaymentRequestRequested())
    return axios
      .put(api.API_URL + `/payment-requests/${paymentRequest.id}`, paymentRequest)
      .then((response) => {
        if (response.data) {
          dispatch(addNotification('actions.paymentRequest.update.success'))
          dispatch(listPaymentRequests())
          return dispatch(updatePaymentRequestSuccess(response.data))
        }
        dispatch(addNotification('actions.paymentRequest.update.error'))
        return dispatch(updatePaymentRequestError('actions.paymentRequest.update.error'))
      })
      .catch((e) => {
        dispatch(addNotification('actions.paymentRequest.update.error'))
        return dispatch(updatePaymentRequestError(e))
      })
  }
}

export {
  CREATE_PAYMENT_REQUEST_REQUESTED,
  CREATE_PAYMENT_REQUEST_SUCCESS,
  CREATE_PAYMENT_REQUEST_ERROR,
  LIST_PAYMENT_REQUESTS_REQUESTED,
  LIST_PAYMENT_REQUESTS_SUCCESS,
  LIST_PAYMENT_REQUESTS_ERROR,
  UPDATE_PAYMENT_REQUEST_REQUESTED,
  UPDATE_PAYMENT_REQUEST_SUCCESS,
  UPDATE_PAYMENT_REQUEST_ERROR
}
