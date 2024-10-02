import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const CREATE_WALLET_REQUESTED = 'CREATE_WALLET_REQUESTED';
const CREATE_WALLET_SUCCESS = 'CREATE_WALLET_SUCCESS';
const CREATE_WALLET_ERROR = 'CREATE_WALLET_ERROR';

const LIST_WALLETS_REQUESTED = 'LIST_WALLETS_REQUESTED';
const LIST_WALLETS_SUCCESS = 'LIST_WALLETS_SUCCESS';
const LIST_WALLETS_ERROR = 'LIST_WALLETS_ERROR';

export const createWalletRequested = () => {
  return { type: CREATE_WALLET_REQUESTED };
}

export const createWalletSuccess = (wallet) => {
  return { type: CREATE_WALLET_SUCCESS, wallet };
}

export const createWalletError = (error) => {
  return { type: CREATE_WALLET_ERROR, error };
}

export const createWallet = (wallet) => {
  validToken()
  return (dispatch) => {
    dispatch(createWalletRequested());
    return axios
      .post(api.API_URL + '/wallets', wallet)
      .then(wallet => {
        console.log(wallet)
        if (wallet.data) {
          dispatch(addNotification('actions.wallet.create.success'))
          return dispatch(createWalletSuccess(wallet.data))
        }
        addNotification('actions.wallet.create.error')
        return dispatch(
          createWalletError('actions.wallet.create.error')
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.wallet.create.error'
          )
        )
        return dispatch(createWalletError(e))
      })
  }
}

export const listWalletsRequested = () => {
  return { type: LIST_WALLETS_REQUESTED, completed: false };
}

export const listWalletsSuccess = (wallets) => {
  return { type: LIST_WALLETS_SUCCESS, completed: true, wallets };
}

export const listWalletsError = (error) => {
  return { type: LIST_WALLETS_ERROR, completed: true, error };
}

export const listWallets = () => {
  validToken()
  return (dispatch) => {
    dispatch(listWalletsRequested());
    return axios
      .get(api.API_URL + '/wallets')
      .then(wallets => {
        if (wallets.data) {
          return dispatch(listWalletsSuccess(wallets.data))
        }
        return dispatch(
          listWalletsError('actions.wallet.list.error')
        )
      })
      .catch(e => {
        return dispatch(listWalletsError(e))
      })
  }
}

export {
  CREATE_WALLET_REQUESTED,
  CREATE_WALLET_SUCCESS,
  CREATE_WALLET_ERROR,
  LIST_WALLETS_REQUESTED,
  LIST_WALLETS_SUCCESS,
  LIST_WALLETS_ERROR
}