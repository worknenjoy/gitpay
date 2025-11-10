import { connect } from 'react-redux'
import { addNotification } from '../actions/notificationActions'
import { registerUser, forgotPassword, resetPassword, searchUser } from '../actions/loginActions'
import { fetchRoles } from '../actions/userRoleActions'
import ResetPasswordPage from '../components/areas/public/features/session/pages/reset-page'

const mapStateToProps = (state, props) => {
  return {
    user: state.loggedIn,
    roles: state.roles
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (msg) => dispatch(addNotification(msg)),
    fetchRoles: () => dispatch(fetchRoles()),
    registerUser: (data) => dispatch(registerUser(data)),
    forgotPassword: (data) => dispatch(forgotPassword(data)),
    resetPassword: (data) => dispatch(resetPassword(data)),
    searchUser: (data) => dispatch(searchUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage)
