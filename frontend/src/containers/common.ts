import { connect } from 'react-redux'
import { registerUser, forgotPassword } from '../actions/loginActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { createTask } from '../actions/taskActions'
import { fetchRoles } from '../actions/userRoleActions'
import { info } from '../actions/infoActions'

const mapStateToProps = (state: any) => {
  return {
    user: state.loggedIn,
    roles: state.roles,
    info: state.info
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    registerUser: (user: any) => dispatch(registerUser(user)),
    forgotPassword: (email: any) => dispatch(forgotPassword(email)),
    createTask: (task: any, history: any) => dispatch(createTask(task, history)),
    fetchRoles: () => dispatch(fetchRoles()),
    getInfo: () => dispatch(info())
  }
}

const CommonContainer = (Component: any) => {
  return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export default CommonContainer
