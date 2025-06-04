import React from 'react'
import useStyles from './loader.styles'
import CircularProgress from '@material-ui/core/CircularProgress'


function CustomizedProgress() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} disableShrink size={60} />
    </div>
  )
}

export default CustomizedProgress
