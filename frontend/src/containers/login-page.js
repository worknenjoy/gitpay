import { connect } from 'react-redux'
import { addNotification } from '../actions/notificationActions'
import LoginPage from '../components/session/login-page'

const mapStateToProps = (state, props) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (msg) => dispatch(addNotification(msg))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
