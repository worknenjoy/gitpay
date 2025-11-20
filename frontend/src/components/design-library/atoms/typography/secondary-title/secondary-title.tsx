import React from 'react'
import BaseTitle from '../base-title/base-title'

type SecondaryTitleProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle: string | React.ReactNode // Allow subtitle to be a string or a React node
}

const SecondaryTitle = ({ title, subtitle }: SecondaryTitleProps) => {
  return (
    <BaseTitle
      title={title}
      subtitle={subtitle}
      level="h6" // Default level set to h6 for secondary titles
    />
  )
}

export default SecondaryTitle
