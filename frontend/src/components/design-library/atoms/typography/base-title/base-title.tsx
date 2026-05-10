import React from 'react'
import { Typography, type TypographyVariant } from '@mui/material'

type BaseTitleProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle: string | React.ReactNode // Allow subtitle to be a string or a React node
  level?: 1 | 2
}

const BaseTitle = ({ title, subtitle, level = 1 }: BaseTitleProps) => {
  const levelToVariantMap: { [key: number]: { title: TypographyVariant; subtitle: TypographyVariant } } = {
    1: {
      title: 'h3',
      subtitle: 'subtitle1'
    },
    2: {
      title: 'h4',
      subtitle: 'subtitle1'
    }
  }

  return (
    <div>
      <Typography variant={levelToVariantMap[level].title}>
        {title}
      </Typography>
      <Typography variant={levelToVariantMap[level].subtitle} gutterBottom>
        {subtitle}
      </Typography>
    </div>
  )
}

export default BaseTitle
