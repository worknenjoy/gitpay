import React, { Component } from 'react'
import Auth from '../../modules/auth'

class Session extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {
    const token = this.props.match.params.token
    const referer = Auth.getReferer()

    Auth.authenticateUser(token)
    if (referer && referer !== '/') {
      this.props.history.replace(referer)
    } else {
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

export default Session
