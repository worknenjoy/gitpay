import React from 'react'
import { Typography } from '@mui/material'

type BaseTitleProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle: string | React.ReactNode // Allow subtitle to be a string or a React node
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' // Optional heading level (1-6)
}

const BaseTitle = ({ title, subtitle, level = 'h5' }: BaseTitleProps) => {
  return (
    <div>
      <Typography variant={level} gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" gutterBottom>
        {subtitle}
      </Typography>
    </div>
  )
}

export default BaseTitle
