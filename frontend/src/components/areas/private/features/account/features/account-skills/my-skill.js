import React from 'react'
import {
  Avatar,
  Chip
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { SkillIcon } from "./skill-icon"

const MySkill = (props) => {
  const { classes, title, onDelete } = props

  return (
    <Chip
      avatar={
        <Avatar>
          <SkillIcon name={title} />
        </Avatar>
      }
      label={title}
      className={classes.chipSkill}
      onDelete={onDelete}
      style={{marginRight: 5}}
    />
  )
}

export default withRouter(MySkill)
