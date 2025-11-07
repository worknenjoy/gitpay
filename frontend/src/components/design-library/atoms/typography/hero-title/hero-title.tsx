import React from 'react'
import { HeroTitleStyled } from './hero-title.styles'
import { Typography } from '@mui/material'

type HeroTitleProps = {
  children: React.ReactNode | string,
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const HeroTitle = ({ children, level }: HeroTitleProps) => {
  return (
    <HeroTitleStyled>
      <Typography variant={level || 'h4'} gutterBottom>
        {children}
      </Typography>
    </HeroTitleStyled>
  )
}

export default HeroTitle