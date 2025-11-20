import {
  SEARCH_PAYOUT_REQUESTED,
  SEARCH_PAYOUT_SUCCESS,
  SEARCH_PAYOUT_FAILED,
} from '../actions/payoutActions'

export const payouts = (state = { data: [], completed: false }, action) => {
  switch (action.type) {
    case SEARCH_PAYOUT_REQUESTED:
      return { ...state, completed: action.completed }
    case SEARCH_PAYOUT_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case SEARCH_PAYOUT_FAILED:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
