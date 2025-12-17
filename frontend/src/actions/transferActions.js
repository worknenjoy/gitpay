import axios from 'axios'
import api from '../consts'
import { addNotification } from './notificationActions'

const SEARCH_TRANSFER_REQUESTED = 'SEARCH_TRANSFER_REQUESTED'
const SEARCH_TRANSFER_SUCCESS = 'SEARCH_TRANSFER_SUCCESS'
const SEARCH_TRANSFER_FAILED = 'SEARCH_TRANSFER_FAILED'

const UPDATE_TRANSFER_REQUESTED = 'UPDATE_TRANSFER_REQUESTED'
const UPDATE_TRANSFER_SUCCESS = 'UPDATE_TRANSFER_SUCCESS'
const UPDATE_TRANSFER_FAILED = 'UPDATE_TRANSFER_FAILED'

const FETCH_TRANSFER_REQUESTED = 'FETCH_TRANSFER_REQUESTED'
const FETCH_TRANSFER_SUCCESS = 'FETCH_TRANSFER_SUCCESS'
const FETCH_TRANSFER_FAILED = 'FETCH_TRANSFER_FAILED'

const searchTransferRequested = () => {
  return {
    type: SEARCH_TRANSFER_REQUESTED,
    completed: false
  }
}

const searchTransferSuccess = (data) => {
  return {
    type: SEARCH_TRANSFER_SUCCESS,
    data: data,
    completed: true
  }
}

const searchTransferFailed = (error) => {
  return {
    type: SEARCH_TRANSFER_FAILED,
    error: error,
    completed: true
  }
}

const searchTransfer = (params) => (dispatch) => {
  dispatch(searchTransferRequested())
  return axios
    .get(api.API_URL + '/transfers/search', { params })
    .then((transfer) => {
      if (transfer.data) {
        return dispatch(searchTransferSuccess(transfer.data))
      }
      if (transfer.error) {
        return dispatch(searchTransferFailed(transfer.error))
      }
    })
    .catch((e) => {
      return dispatch(searchTransferFailed(e))
    })
}

const updateTransferRequested = () => {
  return {
    type: UPDATE_TRANSFER_REQUESTED,
    completed: false
  }
}

const updateTransferSuccess = (data) => {
  return {
    type: UPDATE_TRANSFER_SUCCESS,
    data: data,
    completed: true
  }
}

const updateTransferFailed = (error) => {
  return {
    type: UPDATE_TRANSFER_FAILED,
    error: error,
    completed: true
  }
}

const updateTransfer = (params) => (dispatch) => {
  dispatch(updateTransferRequested())
  return axios
    .put(api.API_URL + '/transfers/update', params)
    .then((transfer) => {
      if (transfer.data.error) {
        dispatch(addNotification('actions.transfer.update.error', { severity: 'error' }))
        return dispatch(updateTransferFailed(transfer.data.error))
      }
      if (transfer.data) {
        dispatch(addNotification('actions.transfer.update.success'))
        return dispatch(updateTransferSuccess(transfer.data))
      }
    })
    .catch((e) => {
      dispatch(addNotification('actions.transfer.update.error', { severity: 'error' }))
      return dispatch(updateTransferFailed(e))
    })
}

const fetchTransferRequested = () => {
  return {
    type: FETCH_TRANSFER_REQUESTED,
    completed: false
  }
}

const fetchTransferSuccess = (data) => {
  return {
    type: FETCH_TRANSFER_SUCCESS,
    data: data,
    completed: true
  }
}

const fetchTransferFailed = (error) => {
  return {
    type: FETCH_TRANSFER_FAILED,
    error: error,
    completed: true
  }
}

const fetchTransfer = (id) => (dispatch) => {
  dispatch(fetchTransferRequested())
  return axios
    .get(api.API_URL + '/transfers/fetch/' + id)
    .then((transfer) => {
      if (transfer.data) {
        return dispatch(fetchTransferSuccess(transfer.data))
      }
      if (transfer.error) {
        return dispatch(fetchTransferFailed(transfer.error))
      }
    })
    .catch((e) => {
      return dispatch(fetchTransferFailed(e))
    })
}

export {
  SEARCH_TRANSFER_REQUESTED,
  SEARCH_TRANSFER_SUCCESS,
  SEARCH_TRANSFER_FAILED,
  UPDATE_TRANSFER_REQUESTED,
  UPDATE_TRANSFER_SUCCESS,
  UPDATE_TRANSFER_FAILED,
  FETCH_TRANSFER_REQUESTED,
  FETCH_TRANSFER_SUCCESS,
  FETCH_TRANSFER_FAILED,
  searchTransfer,
  updateTransfer,
  fetchTransfer
}
