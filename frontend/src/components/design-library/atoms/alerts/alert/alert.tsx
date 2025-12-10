import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Skeleton, Box } from '@mui/material'
import Button from '../../buttons/button/button'
import { CustomAlertStyled } from './alert.styles'

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
    <CustomAlertStyled
      elevation={1}
      variant="standard"
      action={
        <>
          {actions}
          {dismissable && (
            <Button
              label={
                <>
                  Dismiss
                  <CloseIcon fontSize="inherit" />
                </>
              }
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            />
          )}
        </>
      }
      {...rest}
    />
  )
}

export default CustomAlert
