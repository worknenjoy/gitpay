import React from 'react'
import { Typography } from '@mui/material'

const TextField = ({ title }) => {
  return (
    <Typography variant="body1" color="textPrimary" gutterBottom>
      {title}
    </Typography>
  )
}

export default TextField
