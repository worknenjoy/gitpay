import {
  INFO_REQUESTED,
  INFO_SUCCESS,
  INFO_ERROR
} from '../actions/infoActions'

export const info = (state = {
  completed: true,
  error: {
    message: false
  },
  data: {},
  filterValue: null
}, action) => {
  switch (action.type) {
    case INFO_REQUESTED:
      return { ...state, completed: false }
    case INFO_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case INFO_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
