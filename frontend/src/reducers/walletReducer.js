import {
  CREATE_WALLET_REQUESTED,
  CREATE_WALLET_SUCCESS,
  CREATE_WALLET_ERROR,
  LIST_WALLETS_REQUESTED,
  LIST_WALLETS_SUCCESS,
  LIST_WALLETS_ERROR
} from '../actions/walletActions'

export const wallet = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case CREATE_WALLET_REQUESTED:
      return { ...state, completed: action.completed }
    case CREATE_WALLET_SUCCESS:
      return { ...state, completed: action.completed, data: action.wallet }
    case CREATE_WALLET_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const wallets = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case LIST_WALLETS_REQUESTED:
      return { ...state, completed: action.completed }
    case LIST_WALLETS_SUCCESS:
      return { ...state, completed: action.completed, data: action.wallets }
    case LIST_WALLETS_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}