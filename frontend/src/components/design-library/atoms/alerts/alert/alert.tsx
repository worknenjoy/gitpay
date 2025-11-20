import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Skeleton, Box } from '@mui/material'

export const CustomAlert = (props) => {
  const { onClose, alertKey = 'default', actions, dismissable = false, completed, ...rest } = props
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

  if (!completed) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={56} />
      </Box>
    )
  }

  return (
    <Alert
      elevation={1}
      variant="standard"
      action={
        <>
          {actions}
          {dismissable && (
            <Button aria-label="close" color="inherit" size="small" onClick={handleClose}>
              Dismiss
              <CloseIcon fontSize="inherit" />
            </Button>
          )}
        </>
      }
      {...rest}
    />
  )
}

export default CustomAlert
