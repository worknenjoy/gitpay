import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Snackbar,
  IconButton,
} from '@material-ui/core'

import Close from '@material-ui/icons/Close'

class Notification extends Component {
  componentDidMount () { }

  render () {
    return (
      <Snackbar
        anchorOrigin={ {
          vertical: 'bottom',
          horizontal: 'left'
        } }
        open={ this.props.open }
        onClose={ this.props.onClose }
        autoHideDuration={ 6000 }
        SnackbarContentProps={ {
          'aria-describedby': 'message-id'
        } }
        message={ <span id='message-id'>{ this.props.message }</span> }
        action={ [
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={ this.props.onClose }
          >
            <Close />
          </IconButton>
        ] }
      />
    )
  }
}

Notification.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string
}

export default Notification
