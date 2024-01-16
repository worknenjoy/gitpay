import axios from 'axios'
import api from '../consts'

const SEARCH_TRANSFER_REQUESTED = 'SEARCH_TRANSFER_REQUESTED'
const SEARCH_TRANSFER_SUCCESS = 'SEARCH_TRANSFER_SUCCESS'
const SEARCH_TRANSFER_FAILED = 'SEARCH_TRANSFER_FAILED'

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
  return axios.get(api.API_URL + '/transfers/search', { params }).then(
    transfer => {
      if (transfer.data) {
        return dispatch(searchTransferSuccess(transfer.data))
      }
      if (transfer.error) {
        return dispatch(searchTransferFailed(transfer.error))
      }
    }
  ).catch(e => {
    return dispatch(searchTransferFailed(e))
  })
}

export {
  SEARCH_TRANSFER_REQUESTED,
  SEARCH_TRANSFER_SUCCESS,
  SEARCH_TRANSFER_FAILED,
  searchTransfer
}
