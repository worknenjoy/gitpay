import { connect } from 'react-redux'
import { addNotification } from '../../actions/notificationActions'
import { registerUser, forgotPassword, resetPassword } from '../../actions/loginActions'
import { searchUser } from '../../actions/userActions'
import { fetchRoles } from '../../actions/userRoleActions'
import ResetPasswordPage from '../../components/areas/public/features/session/pages/reset-page'

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
    resetPassword: (data: any) => dispatch(resetPassword(data)),
    searchUser: (data: any) => dispatch(searchUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage)
