import React from 'react'
import { Info as InfoIcon } from '@mui/icons-material'
import { SimpleInfoRoot, IconCenter, Text } from './simple-info.styles'

export const SimpleInfo = ({ text }) => {
  return (
    <SimpleInfoRoot>
      <IconCenter>
        <InfoIcon />
      </IconCenter>
      <div>
        <Text>{text}</Text>
      </div>
    </SimpleInfoRoot>
  )
}

export default SimpleInfo
