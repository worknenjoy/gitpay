import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Snackbar,
  IconButton,
} from '@material-ui/core'

import Close from '@material-ui/icons/Close'

class Notification extends Component {

  getActions = () => {
    let actions = [
      <IconButton
        key='close'
        aria-label='Close'
        color='inherit'
        onClick={ this.props.onClose }
      >
        <Close />
      </IconButton>
    ]
    if(this.props.link) {
      actions = [this.getLink(), actions]
    }
  
    return actions
  }

  getLink = () => (
    <a href={ this.props.link }>{this.props.linkLabel || 'View'}</a>
  )

  componentDidMount () { }

  render () {
    return (
      <Snackbar
        anchorOrigin={ {
          vertical: 'bottom',
          horizontal: 'right'
        } }
        open={ this.props.open }
        onClose={ this.props.onClose }
        autoHideDuration={ 8000 }
        snackbarcontentprops={ {
          'aria-describedby': 'message-id'
        } }
        message={ <span id='message-id'>{ this.props.message }</span> }
        action={ this.getActions() }
      />
    )
  }
}

Notification.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string,
  link: PropTypes.string,
  linkLabel: PropTypes.string
}

export default Notification
