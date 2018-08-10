import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import PropTypes from 'prop-types'

class Notification extends Component {
  componentDidMount () {}

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
            <CloseIcon />
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
