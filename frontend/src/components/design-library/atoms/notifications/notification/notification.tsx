import React, { useCallback } from 'react'
import { Snackbar, IconButton, AlertPropsColorOverrides, AlertColor, AlertTitle } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'

import Close from '@mui/icons-material/Close'
import { AlertStyled, StickyAlertWrapper } from './notification.styles'

type NotificationProps = {
  open: boolean
  onClose: () => void
  message: string
  link?: string
  linkLabel?: string
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
  position?: 'top' | 'bottom'
  title?: string
  persistent?: boolean
  sticky?: boolean
  fullWidth?: boolean
}

const Notification = ({ open, onClose, message, link, linkLabel, severity, position = 'bottom', title, persistent = false, sticky = false, fullWidth = false }: NotificationProps) => {
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

  if (sticky) {
    if (!open) return null
    return (
      <StickyAlertWrapper>
        <AlertStyled
          severity={severity}
          onClose={onClose}
          sx={fullWidth ? { borderRadius: 0 } : {}}
          action={<div style={{ display: 'flex', alignItems: 'center' }}>{getActions()}</div>}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </AlertStyled>
      </StickyAlertWrapper>
    )
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: position,
        horizontal: 'right'
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={persistent ? null : 8000}
      color="warning"
    >
      <AlertStyled
        onClose={onClose}
        severity={severity}
        action={<div style={{ display: 'flex', alignItems: 'center' }}>{getActions()}</div>}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </AlertStyled>
    </Snackbar>
  )
}

export default Notification
