import { connect } from 'react-redux'
import { addNotification } from '../actions/notificationActions'
import { registerUser, forgotPassword, resetPassword } from '../actions/loginActions'
import { fetchRoles } from '../actions/userRoleActions'
import SignupPage from '../components/areas/public/features/session/pages/signup-page'

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    roles: state.roles
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (msg, options) => dispatch(addNotification(msg, options)),
    fetchRoles: () => dispatch(fetchRoles()),
    registerUser: (data) => dispatch(registerUser(data)),
    forgotPassword: (data) => dispatch(forgotPassword(data)),
    resetPassword: (data) => dispatch(resetPassword(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)
