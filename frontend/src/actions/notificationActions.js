export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'

export const ADD_DIALOG = 'ADD_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'

/*
 *
 * Notification
 *
 */

export const addNotification = (message) => {
  return (dispatch, getState) => {
    const messages = getState().intl.messages
    return dispatch({ type: ADD_NOTIFICATION, text: messages[message] || message, open: true })
  }
}

export const closeNotification = () => {
  return { type: CLOSE_NOTIFICATION, open: false }
}

/*
 *
 * Dialog
 *
 */

export const addDialog = (target) => {
  return { type: ADD_DIALOG, dialog: true, target }
}

export const closeDialog = () => {
  return { type: CLOSE_DIALOG, dialog: false, target: null }
}
