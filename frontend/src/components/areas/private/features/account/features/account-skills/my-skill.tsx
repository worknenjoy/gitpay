import React from 'react'
import { Avatar, Chip } from '@mui/material'
import { SkillIcon } from './skill-icon'

const MySkill = (props) => {
  const { title, onDelete } = props

  return (
    <Chip
      avatar={
        <Avatar>
          <SkillIcon name={title} />
        </Avatar>
      }
      label={title}
      onDelete={onDelete}
      style={{ marginRight: 5, justifyContent: 'space-between' }}
    />
  )
}

export default MySkill
