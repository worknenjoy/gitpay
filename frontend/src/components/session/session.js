import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Auth from '../../modules/auth'

class Session extends Component {
  componentWillMount () {
    const token = this.props.match.params.token
    const referer = Auth.getReferer()

    Auth.authenticateUser(token)
    if (referer && referer !== '/') {
      this.props.history.replace(referer)
    }
    else {
      this.props.history.replace('/profile')
    }
  }

  render () {
    return (
      <div>
        Session created
      </div>
    )
  }
}

Session.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default Session
