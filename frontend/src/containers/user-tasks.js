import { connect } from 'react-redux'
import UserTasks from '../components/profile/user-tasks'
import { fetchPreferences } from '../actions/preferencesActions'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchRoles, createRoles, deleteRoles } from '../actions/userRoleActions'
import { updateUser, deleteUser } from '../actions/userActions'
import { fetchOrganizations, createOrganizations, updateOrganization } from '../actions/organizationsActions'
import { addNotification, closeNotification } from '../actions/notificationActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({projectId, userId, status}) => dispatch(listTasks({projectId, userId, status})),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTasks)
