import React from 'react'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/lab/AvatarGroup'

export default function TaskInterested({ assigns }) {
  return (
    <AvatarGroup max={4}>
      {assigns &&
        assigns.map((a) => (
          <Avatar alt={a.User && a.User.name} src={a.User && a.User.picture_url} />
        ))}
    </AvatarGroup>
  )
}
