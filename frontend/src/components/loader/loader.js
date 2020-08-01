import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // fix me : this property did not  work
    marginTop: '48vh',
  },
  progress: {
    color: '#009688',
  }
})

function CustomizedProgress ({ classes }) {
  return (
    <div className={ classes.root }>
      <CircularProgress className={ classes.progress } disableShrink size={ 60 } />
    </div>
  )
}
export default withStyles(styles)(CustomizedProgress)
