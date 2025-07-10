import React, { useState } from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'
import useStyles from './alert.styles'
import { Button } from '@material-ui/core'
import ReactPlacholder from 'react-placeholder'


export const Alert = (props) => {
  const { onClose, alertKey = 'default', actions, dismissable = false, completed, ...rest } = props
  const classes = useStyles()
  const fullAlertKey = `alert-dismissed-${alertKey}`

  const [open, setOpen] = useState(() => {
    const dismissed = localStorage.getItem(fullAlertKey)
    return dismissed !== 'true'
  })

  const handleClose = (event) => {
    setOpen(false)
    localStorage.setItem(fullAlertKey, 'true')
    if (onClose) {
      onClose(event)
    }
  }

  if (!open) {
    return null
  }

  return (
    <ReactPlacholder rows={1} type="text" ready={completed}>
      <MuiAlert
        elevation={1}
        variant="standard"
        action={
          <>
            {actions}
            {dismissable && (
              <Button
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
                className={classes.closeButton}
              >
                Dismiss
                <CloseIcon fontSize="inherit" />
              </Button>
            )}
          </>
        }
        {...rest}
      />
    </ReactPlacholder>
  )
}

export default Alert