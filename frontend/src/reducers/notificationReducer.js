import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  ADD_DIALOG,
  CLOSE_DIALOG,
} from '../actions/notificationActions'

export const notification = (state = { open: false }, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return { ...state, text: action.text, open: true }
    case CLOSE_NOTIFICATION:
      return { ...state, open: false }
    default:
      return state
  }
}

export const dialog = (state = { open: false, target: null }, action) => {
  switch (action.type) {
    case ADD_DIALOG:
      return { ...state, open: action.dialog, target: action.target }
    case CLOSE_DIALOG:
      return { ...state, open: action.dialog, target: null }
    default:
      return state
  }
}
