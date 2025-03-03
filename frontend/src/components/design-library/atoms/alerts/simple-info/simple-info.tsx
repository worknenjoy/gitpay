import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Info as InfoIcon
} from '@material-ui/icons'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  iconCenter: {
    verticalAlign: 'middle',
    paddingRight: 5
  },
}))

export const SimpleInfo = ({ text }) => {
  const classes = useStyles()

  return (
    <div style={{ paddingBottom: 10, display: 'flex', alignItems: 'center' }}>
      <div>
        <InfoIcon className={classes.iconCenter} style={{ color: 'action' }} />
      </div>
      <div>
        <Typography variant='body2' gutterBottom style={{ color: 'gray', marginTop: 5, fontSize: 11 }}>
          {text}
        </Typography>
      </div>
    </div>
  )
}

export default SimpleInfo