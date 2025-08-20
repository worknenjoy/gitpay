import React from 'react'
import useStyles from './simple-info.styles'
import {
  Info as InfoIcon
} from '@mui/icons-material'
import { Typography } from '@mui/material'


export const SimpleInfo = ({ text }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div>
        <InfoIcon className={classes.iconCenter} />
      </div>
      <div>
        <Typography variant="body2" gutterBottom className={classes.text}>
          {text}
        </Typography>
      </div>
    </div>
  )
}

export default SimpleInfo