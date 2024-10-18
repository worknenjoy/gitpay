import React from 'react'
import MuiAlert from '@material-ui/lab/Alert'

export const Alert = (props) => {
  return (
    <MuiAlert elevation={1} variant="filled" {...props} />
  )
}

export default Alert