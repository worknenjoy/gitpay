import React from 'react'
import { HeroTitleStyled } from './hero-title.styles'
import { Typography } from '@mui/material'

const HeroTitle = ({ children, level }) => {
  return (
    <HeroTitleStyled>
      <Typography variant={level || 'h4'} gutterBottom>
        {children}
      </Typography>
    </HeroTitleStyled>
  )
}

export default HeroTitle