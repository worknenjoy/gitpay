import React from 'react'
import useStyles from './loader.styles'
import CircularProgress from '@mui/material/CircularProgress'


function CustomizedProgress() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} disableShrink size={60} />
    </div>
  )
}

export default CustomizedProgress
