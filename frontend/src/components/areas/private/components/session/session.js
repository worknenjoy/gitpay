import { Component } from 'react'
import PropTypes from 'prop-types'
import Auth from '../../../../../modules/auth'

class Session extends Component {
  componentDidMount() {
    const { match, history } = this.props
    const token = match.params.token
    const referer = Auth.getReferer()

    Auth.authenticateUser(token)

    if (referer && referer !== '/') {
      history.replace(referer)
    } else {
      history.replace('/profile')
    }
  }

  render() {
    // Nothing to show; we immediately redirect
    return null
  }
}

Session.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default Session
