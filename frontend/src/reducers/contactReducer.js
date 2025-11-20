import {
  MESSAGE_RECRUITERS_REQUESTED,
  MESSAGE_RECRUITERS_SUCCESS,
  MESSAGE_RECRUITERS_ERROR
} from '../actions/contactActions'

export const contact = (
  state = {
    completed: true
  },
  action
) => {
  switch (action.type) {
    case MESSAGE_RECRUITERS_REQUESTED:
      return { ...state, completed: false }
    case MESSAGE_RECRUITERS_SUCCESS:
      return { ...state, completed: true }
    case MESSAGE_RECRUITERS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
