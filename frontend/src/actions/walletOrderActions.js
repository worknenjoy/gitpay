import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const CREATE_WALLET_ORDER_REQUESTED = 'CREATE_WALLET_ORDER_REQUESTED'
const CREATE_WALLET_ORDER_SUCCESS = 'CREATE_WALLET_ORDER_SUCCESS'
const CREATE_WALLET_ORDER_ERROR = 'CREATE_WALLET_ORDER_ERROR'

const LIST_WALLET_ORDERS_REQUESTED = 'LIST_WALLET_ORDERS_REQUESTED'
const LIST_WALLET_ORDERS_SUCCESS = 'LIST_WALLET_ORDERS_SUCCESS'
const LIST_WALLET_ORDERS_ERROR = 'LIST_WALLET_ORDERS_ERROR'

const FETCH_WALLET_ORDER_REQUESTED = 'FETCH_WALLET_ORDER_REQUESTED'
const FETCH_WALLET_ORDER_SUCCESS = 'FETCH_WALLET_ORDER_SUCCESS'
const FETCH_WALLET_ORDER_ERROR = 'FETCH_WALLET_ORDER_ERROR'

export const createWalletOrderRequested = () => {
  return { type: CREATE_WALLET_ORDER_REQUESTED }
}

export const createWalletOrderSuccess = (walletOrder) => {
  return { type: CREATE_WALLET_ORDER_SUCCESS, walletOrder }
}

export const createWalletOrderError = (error) => {
  return { type: CREATE_WALLET_ORDER_ERROR, error }
}

export const createWalletOrder = (walletOrder) => {
  validToken()
  return (dispatch) => {
    dispatch(createWalletOrderRequested())
    return axios
      .post(api.API_URL + '/wallets/orders', walletOrder)
      .then((walletOrder) => {
        if (walletOrder.data) {
          dispatch(addNotification('actions.walletOrder.create.success'))
          return dispatch(createWalletOrderSuccess(walletOrder.data))
        }
        addNotification('actions.walletOrder.create.error')
        return dispatch(createWalletOrderError('actions.walletOrder.create.error'))
      })
      .catch((e) => {
        dispatch(addNotification('actions.walletOrder.create.error'))
        return dispatch(createWalletOrderError(e))
      })
  }
}

export const listWalletOrdersRequested = () => {
  return { type: LIST_WALLET_ORDERS_REQUESTED, completed: false }
}

export const listWalletOrdersSuccess = (walletOrders) => {
  return { type: LIST_WALLET_ORDERS_SUCCESS, completed: true, walletOrders }
}

export const listWalletOrdersError = (error) => {
  return { type: LIST_WALLET_ORDERS_ERROR, completed: true, error }
}

export const listWalletOrders = (walletId) => {
  validToken()
  return (dispatch) => {
    dispatch(listWalletOrdersRequested())
    return axios
      .get(api.API_URL + '/wallets/orders', { params: { walletId } })
      .then((walletOrders) => {
        if (walletOrders.data) {
          return dispatch(listWalletOrdersSuccess(walletOrders.data))
        }
        return dispatch(listWalletOrdersError('actions.walletOrder.list.error'))
      })
      .catch((e) => {
        return dispatch(listWalletOrdersError(e))
      })
  }
}

export const fetchWalletOrderRequested = () => {
  return { type: FETCH_WALLET_ORDER_REQUESTED }
}

export const fetchWalletOrderSuccess = (walletOrder) => {
  return { type: FETCH_WALLET_ORDER_SUCCESS, walletOrder }
}

export const fetchWalletOrderError = (error) => {
  return { type: FETCH_WALLET_ORDER_ERROR, error }
}

export const fetchWalletOrder = (id) => {
  validToken()
  return (dispatch) => {
    dispatch(fetchWalletOrderRequested())
    return axios
      .get(api.API_URL + '/wallets/orders/' + id)
      .then((walletOrder) => {
        if (walletOrder.data) {
          return dispatch(fetchWalletOrderSuccess(walletOrder.data))
        }
        return dispatch(fetchWalletOrderError('actions.walletOrder.fetch.error'))
      })
      .catch((e) => {
        return dispatch(fetchWalletOrderError(e))
      })
  }
}

export {
  CREATE_WALLET_ORDER_REQUESTED,
  CREATE_WALLET_ORDER_SUCCESS,
  CREATE_WALLET_ORDER_ERROR,
  LIST_WALLET_ORDERS_REQUESTED,
  LIST_WALLET_ORDERS_SUCCESS,
  LIST_WALLET_ORDERS_ERROR,
  FETCH_WALLET_ORDER_REQUESTED,
  FETCH_WALLET_ORDER_SUCCESS,
  FETCH_WALLET_ORDER_ERROR
}
