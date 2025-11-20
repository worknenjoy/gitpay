import { connect } from 'react-redux'
import Topbar from '../components/shared/topbar/topbar'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { createTask } from '../actions/taskActions'
import { fetchPreferences } from '../actions/preferencesActions'
import { updateUser } from '../actions/userActions'
import { info } from '../actions/infoActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    dialog: state.dialog,
    roles: state.roles,
    user: getUserData(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)
