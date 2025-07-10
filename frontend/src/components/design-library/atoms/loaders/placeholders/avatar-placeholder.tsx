import React from 'react'
import { RoundShape } from 'react-placeholder/lib/placeholders'
import useStyles from './avatar-placeholder.styles'

export const AvatarPlaceholder = () => {
  const classes = useStyles()
  return (
    <div className="avatar-placeholder">
      <RoundShape color="#ccc" className={classes.placeholder} />
    </div>
  )
}
