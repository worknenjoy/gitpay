import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { Snackbar, IconButton } from '@mui/material'

import Close from '@mui/icons-material/Close'

const Notification = ({ open, onClose, message, link, linkLabel }) => {
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
      message={<span id="message-id">{message}</span>}
      action={getActions()}
    />
  )
}

Notification.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string,
  link: PropTypes.string,
  linkLabel: PropTypes.string
}

export default Notification
