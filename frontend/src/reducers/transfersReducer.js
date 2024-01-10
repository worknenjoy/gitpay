import {
  SEARCH_TRANSFER_REQUESTED,
  SEARCH_TRANSFER_SUCCESS,
  SEARCH_TRANSFER_FAILED
} from '../actions/transferActions'

export const transfers = (state = { data: [], completed: false }, action) => {
  switch (action.type) {
    case SEARCH_TRANSFER_REQUESTED:
      return { ...state, completed: action.completed }
    case SEARCH_TRANSFER_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case SEARCH_TRANSFER_FAILED:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
