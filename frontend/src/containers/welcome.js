import { connect } from 'react-redux'
import Welcome from '../components/areas/public/features/welcome/pages/welcome-page'
import { createTask } from '../actions/taskActions'
import { addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn, logOut, registerUser, forgotPassword } from '../actions/loginActions'
import { info } from '../actions/infoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.loggedIn,
    info: state.info.data,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    getInfo: () => dispatch(info()),
    registerUser: (data) => dispatch(registerUser(data)),
    forgotPassword: (data) => dispatch(forgotPassword(data)),
    createTask: (task, history) => dispatch(createTask(task, history)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
