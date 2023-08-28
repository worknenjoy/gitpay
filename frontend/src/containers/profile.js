import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { fetchPreferences } from '../actions/preferencesActions'
import { logOut } from '../actions/loginActions'
import { listTasks, filterTasks, createTask } from '../actions/taskActions'
import { fetchRoles, createRoles, deleteRoles } from '../actions/userRoleActions'
import { updateUser, deleteUser, resendActivationEmail } from '../actions/userActions'
import { fetchOrganizations, createOrganizations, updateOrganization } from '../actions/organizationsActions'
import { addNotification, closeNotification } from '../actions/notificationActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: getUser(state),
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
    fetchRoles: () => dispatch(fetchRoles()),
    createRoles: (rolesData) => dispatch(createRoles(rolesData)),
    deleteRoles: (rolesData) => dispatch(deleteRoles(rolesData)),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateOrganization: (org) => dispatch(updateOrganization(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    resendActivationEmail: (userId) => dispatch(resendActivationEmail(userId)),
    deleteUser: (user) => dispatch(deleteUser(user)),
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: (message) => dispatch(closeNotification(message)),
    createTask: (task, history) => dispatch(createTask(task, history)),
    listTasks: ({ projectId, userId, status }) => dispatch(listTasks({ projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    signOut: () => dispatch(logOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
