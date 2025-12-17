export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'

export const ADD_DIALOG = 'ADD_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'

/*
 *
 * Notification
 *
 */

type NotificationOptionsProps = {
  link?: string | null
  severity: 'error' | 'warning' | 'info' | 'success'
  extra?: string
}

export const addNotification = (message: string, options: NotificationOptionsProps) => {
  const { link, severity, extra = '' } = options || {}

  return (dispatch, getState) => {
    const state = getState()
    const messages = state.intl.messages

    return dispatch({
      type: ADD_NOTIFICATION,
      text: extra ? `${messages[message]} - ${extra}` : messages[message] || message,
      open: true,
      link,
      severity
    })
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
