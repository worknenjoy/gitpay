import React from 'react'
import styles from './loader.styles'

function CustomizedProgress() {
  const { Root, Progress } = styles as any

  return (
    <Root>
      <Progress disableShrink size={60} />
    </Root>
  )
}

export default CustomizedProgress
