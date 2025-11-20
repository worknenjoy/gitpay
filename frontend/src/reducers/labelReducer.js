import {
  LIST_LABELS_REQUEST,
  LIST_LABELS_SUCCESS,
  LIST_LABELS_ERROR
} from '../actions/labelActions'

export const labels = (
  state = {
    completed: true,
    data: []
  },
  action
) => {
  switch (action.type) {
    case LIST_LABELS_REQUEST:
      return { ...state, completed: false }
    case LIST_LABELS_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case LIST_LABELS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
