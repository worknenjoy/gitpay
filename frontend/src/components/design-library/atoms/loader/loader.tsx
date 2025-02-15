import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // fix me : this property did not work
    height: '100%',
  },
  progress: {
    color: '#009688',
  }
}))

function CustomizedProgress() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} disableShrink size={60} />
    </div>
  )
}

export default CustomizedProgress
