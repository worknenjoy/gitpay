import React from 'react'
import { Avatar, Chip } from '@mui/material'
import { withRouter } from 'react-router-dom'
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
      style={{ marginRight: 5 }}
    />
  )
}

export default withRouter(MySkill)
