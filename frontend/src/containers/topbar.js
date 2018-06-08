import { connect } from 'react-redux'
import Topbar from '../components/topbar/topbar'
import { addNotification } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { createTask } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed,
    task: state.task
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    addNotification: (msg) => dispatch(addNotification(msg)),
    createTask: (task, history) => dispatch(createTask(task, history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)
