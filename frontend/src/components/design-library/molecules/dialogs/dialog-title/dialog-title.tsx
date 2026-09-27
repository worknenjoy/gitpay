import React from 'react'
import { DialogTitle as MuiDialogTitle, IconButton, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export type DialogTitleProps = {
  icon?: React.ReactNode
  title: React.ReactNode
  onClose?: () => void
  id?: string
}

const DialogTitle = ({ icon, title, onClose, id }: DialogTitleProps) => (
  <MuiDialogTitle
    id={id}
    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: onClose ? 6 : undefined }}
  >
    {icon && <Box sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</Box>}
    <Box sx={{ flex: 1, minWidth: 0 }}>{title}</Box>
    {onClose && (
      <IconButton
        aria-label="close"
        onClick={onClose}
        size="small"
        sx={{ position: 'absolute', right: 12, top: 12 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}
  </MuiDialogTitle>
)

export default DialogTitle
