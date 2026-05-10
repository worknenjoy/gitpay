import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Skeleton, Box } from '@mui/material'
import Button from '../../buttons/button/button'
import { CustomAlertStyled } from './alert.styles'

const skeletonBgBySeverity = {
  warning: '#FFF8F0',
  info: '#F0F7FF',
  error: '#FFF0F0',
  success: '#F0FFF4'
}

export const CustomAlert = (props) => {
  const {
    onClose,
    alertKey = 'default',
    actions,
    dismissable = false,
    completed,
    severity = 'info',
    ...rest
  } = props
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          p: '12px 16px',
          bgcolor: skeletonBgBySeverity[severity] ?? '#F0F7FF',
          borderRadius: 1,
          borderLeft: '4px solid',
          borderColor: `${severity}.main`
        }}
      >
        <Skeleton variant="circular" width={22} height={22} sx={{ mt: 0.25, flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="28%" height={22} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="80%" height={18} />
        </Box>
      </Box>
    )
  }

  return (
    <CustomAlertStyled
      elevation={1}
      variant="standard"
      severity={severity}
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
