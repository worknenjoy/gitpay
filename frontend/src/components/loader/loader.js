import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

function Loader () {
  return <CircularProgress disableShrink size={ 200 } color='secondary' />
}
export default Loader
