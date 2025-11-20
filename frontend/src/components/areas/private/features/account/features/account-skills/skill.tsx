import React from 'react'
import { Grid, Typography, Checkbox } from '@mui/material'
import { SkillIcon } from './skill-icon'
import { SkillAvatar } from './skill.styles'

type SkillProps = {
  title: string
  onClick?: () => void
  isSelected?: boolean
}

function Skill({ title, onClick, isSelected }: SkillProps) {
  return (
    <Grid container direction="row" alignItems="center" size={{ xs: 6 }}>
      <Grid size={{ xs: 2 }}>
        <SkillAvatar greyed={!isSelected}>
          <SkillIcon name={title} />
        </SkillAvatar>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Typography variant="body1" color="primary">
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 4 }} alignItems="flex-end">
        <Checkbox onClick={onClick} checked={isSelected ? true : false} />
      </Grid>
    </Grid>
  )
}

export default Skill
