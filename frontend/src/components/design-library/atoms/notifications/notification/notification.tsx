import React, { useCallback } from 'react'
import { Snackbar, IconButton, AlertPropsColorOverrides, AlertColor } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'

import Close from '@mui/icons-material/Close'
import { AlertStyled } from './notification.styles'

type NotificationProps = {
  open: boolean
  onClose: () => void
  message: string
  link?: string
  linkLabel?: string
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
}

const Notification = ({ open, onClose, message, link, linkLabel, severity }: NotificationProps) => {
  const getActions = useCallback(() => {
    let actions = [
      <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
        <Close />
      </IconButton>
    ]
    if (link) {
      actions = [getLink(), ...actions]
    }

    return actions
  }, [onClose, link])

  const getLink = useCallback(() => <a href={link}>{linkLabel || 'View'}</a>, [link, linkLabel])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={8000}
      color="warning"
    >
      <AlertStyled
        onClose={onClose}
        severity={severity}
        action={<div style={{ display: 'flex', alignItems: 'center' }}>{getActions()}</div>}
      >
        {message}
      </AlertStyled>
    </Snackbar>
  )
}

export default Notification
