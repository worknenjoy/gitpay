import React from 'react'
import Typography from 'material-ui/Typography'

const TabContainer = props => {
  return (
    <Typography component='div' style={ { padding: 8 * 3 } }>
      { props.children }
    </Typography>
  )
}

export default TabContainer
