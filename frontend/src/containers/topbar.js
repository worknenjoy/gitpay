import { connect } from 'react-redux'
import Topbar from '../components/topbar/topbar'
import { addNotification } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { createTask } from '../actions/taskActions'
import { fetchPreferences } from '../actions/preferencesActions'
import { updateUser } from '../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed,
    task: state.task,
    preferences: state.preferences
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    addNotification: (msg) => dispatch(addNotification(msg)),
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    updateUser: (user) => dispatch(updateUser(user)),
    createTask: (task, history) => dispatch(createTask(task, history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)
