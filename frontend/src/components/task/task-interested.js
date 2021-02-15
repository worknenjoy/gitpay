import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

export default function TaskInterested ({ assigns }) {
  return (
    <AvatarGroup max={ 4 }>
      { assigns && assigns.map(a => <Avatar alt={ a.User && a.User.name } src={ a.User && a.User.picture_url } />) }
    </AvatarGroup>
  )
}
