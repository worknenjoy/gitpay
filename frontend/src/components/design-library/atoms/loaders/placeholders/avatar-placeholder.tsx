import React from 'react'
import { Skeleton } from '@mui/material'
import useStyles from './avatar-placeholder.styles'

export const AvatarPlaceholder = () => {
  const classes = useStyles()
  return (
    <div className="avatar-placeholder">
      <Skeleton variant="circular" className={classes.placeholder} />
    </div>
  )
}
