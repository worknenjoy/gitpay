import React from 'react'
import BaseTitle from '../base-title/base-title'

type MainTitleProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle?: string | React.ReactNode // Allow subtitle to be a string or a React node
}

const MainTitle = ({ title, subtitle }: MainTitleProps) => {
  return (
    <BaseTitle
      title={title}
      subtitle={subtitle}
      level="h5" // Default level set to h5
    />
  )
}

export default MainTitle
