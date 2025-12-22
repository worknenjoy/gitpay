import React from 'react'
import { connect } from 'react-redux'
import { addNotification} from '../actions/notificationActions'
import { createTask } from '../actions/taskActions'
import { loggedIn, logOut, registerUser, forgotPassword } from '../actions/loginActions'
import { fetchRoles } from '../actions/userRoleActions'
import { info } from '../actions/infoActions'

const CommonContainer = (WrappedComponent, customMapStateToProps = () => ({})) => {
  const ConnectedComponent = (props) => {
    return <WrappedComponent {...props} />
  }

  const mapStateToProps = (state, ownProps) => ({
    user: state.loggedIn,
    info: state.info.data,
    roles: state.roles,
    ...customMapStateToProps(state), // 🔥 Allow dynamic Redux state injection!
    ...ownProps // Ensure extra props passed from Router are kept
  })

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      addNotification: (message, options) => dispatch(addNotification(message, options)),
      isLogged: () => dispatch(loggedIn()),
      signOut: () => dispatch(logOut()),
      getInfo: () => dispatch(info()),
      registerUser: (data) => dispatch(registerUser(data)),
      forgotPassword: (data) => dispatch(forgotPassword(data)),
      createTask: (task, history) => dispatch(createTask(task, history)),
      fetchRoles: () => dispatch(fetchRoles()),
      ...ownProps // Ensure extra props passed from Router are kept
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent)
}

export default CommonContainer
