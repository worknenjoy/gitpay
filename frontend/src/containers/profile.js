import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
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
    preferences: state.preferences,
    tasks: getFilteredTasks(state),
    roles: state.roles,
    organizations: state.organizations.organizations,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    fetchRoles: dispatch(fetchRoles()),
    createRoles: (rolesData) => dispatch(createRoles(rolesData)),
    deleteRoles: (rolesData) => dispatch(deleteRoles(rolesData)),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateOrganization: (org) => dispatch(updateOrganization(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    deleteUser: (user) => dispatch(deleteUser(user)),
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: (message) => dispatch(closeNotification(message)),
    listTasks: ({projectId, userId, status}) => dispatch(listTasks({projectId, userId, status})),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
