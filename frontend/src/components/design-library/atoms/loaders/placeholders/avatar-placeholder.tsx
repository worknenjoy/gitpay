import React from 'react'
import styles from './avatar-placeholder.styles'

export const AvatarPlaceholder = () => {
  const { Placeholder } = styles as any
  return (
    <div className="avatar-placeholder">
      <Placeholder variant="circular" />
    </div>
  )
}
