import { connect } from 'react-redux'
import Roles from '../components/profile/user-roles'
import { addNotification, closeNotification } from '../actions/notificationActions'

const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.roles
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: () => dispatch(closeNotification())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles)
