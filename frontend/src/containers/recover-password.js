import { connect } from 'react-redux'
import { searchUser, resetPassword } from '../actions/loginActions'
import { addNotification } from '../actions/notificationActions'
import LoginPage from '../components/areas/private/components/session/login-page'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, props) => {
  return {
    user: getUserData(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (msg) => dispatch(addNotification(msg)),
    searchUser: (data) => dispatch(searchUser(data)),
    resetPassword: (data) => dispatch(resetPassword(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
