import {
  SEARCH_TRANSFER_REQUESTED,
  SEARCH_TRANSFER_SUCCESS,
  SEARCH_TRANSFER_FAILED,
  FETCH_TRANSFER_REQUESTED,
  FETCH_TRANSFER_SUCCESS,
  FETCH_TRANSFER_FAILED,
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

export const transfer = (state = { data: {}, completed: false }, action) => {
  switch (action.type) {
    case FETCH_TRANSFER_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_TRANSFER_SUCCESS:
      return { ...state, completed: action.completed, data: action.data }
    case FETCH_TRANSFER_FAILED:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
