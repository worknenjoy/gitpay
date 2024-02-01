import axios from 'axios'
import api from '../consts'

const SEARCH_PAYOUT_REQUESTED = 'SEARCH_PAYOUT_REQUESTED'
const SEARCH_PAYOUT_SUCCESS = 'SEARCH_PAYOUT_SUCCESS'
const SEARCH_PAYOUT_FAILED = 'SEARCH_PAYOUT_FAILED'

const searchPayoutRequested = () => {
  return {
    type: SEARCH_PAYOUT_REQUESTED,
    completed: false

  }
}

const searchPayoutSuccess = (data) => {
  return {
    type: SEARCH_PAYOUT_SUCCESS,
    data: data,
    completed: true
  }
}

const searchPayoutFailed = (error) => {
  return {
    type: SEARCH_PAYOUT_FAILED,
    error: error,
    completed: true
  }
}

const searchPayout = (params) => (dispatch) => {
  dispatch(searchPayoutRequested())
  return axios.get(api.API_URL + '/payouts/search', { params }).then(
    payout => {
      if (payout.data) {
        return dispatch(searchPayoutSuccess(payout.data))
      }
      if (payout.error) {
        return dispatch(searchPayoutFailed(payout.error))
      }
    }
  ).catch(e => {
    return dispatch(searchPayoutFailed(e))
  })
}

export {
  SEARCH_PAYOUT_REQUESTED,
  SEARCH_PAYOUT_SUCCESS,
  SEARCH_PAYOUT_FAILED,
  searchPayout
}
