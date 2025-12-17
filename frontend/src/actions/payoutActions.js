import axios from 'axios'
import api from '../consts'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const REQUEST_PAYOUT_REQUESTED = 'REQUEST_PAYOUT_REQUESTED'
const REQUEST_PAYOUT_SUCCESS = 'REQUEST_PAYOUT_SUCCESS'
const REQUEST_PAYOUT_FAILED = 'REQUEST_PAYOUT_FAILED'

const SEARCH_PAYOUT_REQUESTED = 'SEARCH_PAYOUT_REQUESTED'
const SEARCH_PAYOUT_SUCCESS = 'SEARCH_PAYOUT_SUCCESS'
const SEARCH_PAYOUT_FAILED = 'SEARCH_PAYOUT_FAILED'

const requestPayoutRequested = () => {
  return {
    type: REQUEST_PAYOUT_REQUESTED,
    completed: false
  }
}

const requestPayoutSuccess = (data) => {
  return {
    type: REQUEST_PAYOUT_SUCCESS,
    data: data,
    completed: true
  }
}

const requestPayoutFailed = (error) => {
  return {
    type: REQUEST_PAYOUT_FAILED,
    error: error,
    completed: true
  }
}

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

const requestPayout = (params) => (dispatch) => {
  dispatch(requestPayoutRequested())
  return axios
    .post(api.API_URL + '/payouts/request', params)
    .then((payout) => {
      if (payout.data) {
        dispatch(addNotification('actions.payoutRequest.create.success'))
        return dispatch(requestPayoutSuccess(payout.data))
      }
      if (payout.error) {
        dispatch(addNotification('actions.payoutRequest.create.error', { severity: 'error' }))
        return dispatch(requestPayoutFailed(payout.error))
      }
    })
    .catch((e) => {
      dispatch(addNotification('actions.payoutRequest.create.error', e))
      return dispatch(requestPayoutFailed(e))
    })
}

const searchPayout = (params) => (dispatch) => {
  validToken()
  dispatch(searchPayoutRequested())
  return axios
    .get(api.API_URL + '/payouts/search', { params })
    .then((payout) => {
      if (payout.data) {
        return dispatch(searchPayoutSuccess(payout.data))
      }
      if (payout.error) {
        dispatch(addNotification('actions.payoutRequest.search.error', { severity: 'error' }))
        return dispatch(searchPayoutFailed(payout.error))
      }
    })
    .catch((e) => {
      dispatch(addNotification('actions.payoutRequest.search.error', { severity: 'error' }))
      return dispatch(searchPayoutFailed(e))
    })
}

export {
  REQUEST_PAYOUT_REQUESTED,
  REQUEST_PAYOUT_SUCCESS,
  REQUEST_PAYOUT_FAILED,
  SEARCH_PAYOUT_REQUESTED,
  SEARCH_PAYOUT_SUCCESS,
  SEARCH_PAYOUT_FAILED,
  requestPayout,
  searchPayout
}
