import { connect } from 'react-redux'
import { addNotification } from '../../actions/notificationActions'
import { registerUser, forgotPassword, resetPassword } from '../../actions/loginActions'
import { fetchRoles } from '../../actions/userRoleActions'
import ForgotPasswordPage from '../../components/areas/public/features/session/pages/forgot-page'

const mapStateToProps = (state: any, props: any) => {
  return {
    user: state.user,
    roles: state.roles
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    addNotification: (msg: any, options: any) => dispatch(addNotification(msg, options)),
    fetchRoles: () => dispatch(fetchRoles()),
    registerUser: (data: any) => dispatch(registerUser(data)),
    forgotPassword: (data: any) => dispatch(forgotPassword(data)),
    resetPassword: (data: any) => dispatch(resetPassword(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage)
