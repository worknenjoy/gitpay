import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const CREATE_WALLET_REQUESTED = 'CREATE_WALLET_REQUESTED';
const CREATE_WALLET_SUCCESS = 'CREATE_WALLET_SUCCESS';
const CREATE_WALLET_ERROR = 'CREATE_WALLET_ERROR';

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

export {
  CREATE_WALLET_REQUESTED,
  CREATE_WALLET_SUCCESS,
  CREATE_WALLET_ERROR
}