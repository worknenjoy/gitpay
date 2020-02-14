import { connect } from 'react-redux'
import TopBar from '../components/topbar/topbar'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { createTask } from '../actions/taskActions'
import { fetchPreferences } from '../actions/preferencesActions'
import { updateUser } from '../actions/userActions'
import { info } from '../actions/infoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    dialog: state.dialog,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed,
    task: state.task,
    preferences: state.preferences,
    channelUserCount: state.info.data.channelUserCount
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    addNotification: (msg) => dispatch(addNotification(msg)),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    createTask: (task, history) => dispatch(createTask(task, history)),
    info: () => dispatch(info())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
