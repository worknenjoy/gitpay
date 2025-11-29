import React from 'react'
import { Grid, Typography, Checkbox, useTheme } from '@mui/material'
import { SkillIcon } from './skill-icon'
import { SkillAvatar } from './skill.styles'

type SkillProps = {
  title: string
  onClick?: () => void
  isSelected?: boolean
}

function Skill({ title, onClick, isSelected }: SkillProps) {
  const theme = useTheme()
  const isMobile = theme.breakpoints.down('sm')
  return (
    <Grid container direction="row" alignItems="center" size={{ xs: 12, md: 6 }} spacing={isMobile ? 4 : 1}>
      <Grid size={{ xs: 2, md: 1 }}>
        <SkillAvatar greyed={!isSelected}>
          <SkillIcon name={title} />
        </SkillAvatar>
      </Grid>
      <Grid size={{ xs: 6, md: 7 }}>
        <Typography variant="body1" color="primary">
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 4, md: 4 }} alignItems="flex-end">
        <Checkbox onClick={onClick} checked={isSelected ? true : false} />
      </Grid>
    </Grid>
  )
}

export default Skill
