import axios from 'axios'

const SEARCH_TRANSFER_REQUESTED = 'SEARCH_TRANSFER_REQUESTED'
const SEARCH_TRANSFER_SUCCESS = 'SEARCH_TRANSFER_SUCCESS'
const SEARCH_TRANSFER_FAILED = 'SEARCH_TRANSFER_FAILED'

const searchTransferRequested = () => {
  return {
    type: SEARCH_TRANSFER_REQUESTED
  }
}

const searchTransferSuccess = (data) => {
  return {
    type: SEARCH_TRANSFER_SUCCESS,
    payload: data
  }
}

const searchTransferFailed = (error) => {
  return {
    type: SEARCH_TRANSFER_FAILED,
    payload: error
  }
}


const searchTransfer = (params) => async (dispatch) => {
  dispatch(searchTransferRequested())
  try {
    const response = await axios.get(`/transfers/search`, params)
    return dispatch(searchTransferSuccess(response.data))
  } catch (e) {
    return dispatch(searchTransferFailed(e))
  }
}

export {
  SEARCH_TRANSFER_REQUESTED,
  SEARCH_TRANSFER_SUCCESS,
  SEARCH_TRANSFER_FAILED,
  searchTransfer
}