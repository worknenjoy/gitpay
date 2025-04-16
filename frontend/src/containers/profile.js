import { connect } from 'react-redux'
import PrivatePage from '../components/areas/private/pages/private-page'
import { fetchPreferences } from '../actions/preferencesActions'
import { logOut, changePassword } from '../actions/loginActions'
import { listTasks, filterTasks, createTask } from '../actions/taskActions'
import { fetchRoles, createRoles, deleteRoles } from '../actions/userRoleActions'
import { updateUser, deleteUser, resendActivationEmail } from '../actions/userActions'
import { fetchOrganizations, createOrganizations, updateOrganization } from '../actions/organizationsActions'
import { addNotification, closeNotification } from '../actions/notificationActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    preferences: state.preferences,
    tasks: getFilteredTasks(state),
    organizations: state.organizations.organizations,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateOrganization: (org) => dispatch(updateOrganization(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    changePassword: (data) => dispatch(changePassword(data)),
    resendActivationEmail: (userId) => dispatch(resendActivationEmail(userId)),
    deleteUser: (user) => dispatch(deleteUser(user)),
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: (message) => dispatch(closeNotification(message)),
    createTask: (task, history) => dispatch(createTask(task, history)),
    listTasks: ({ organizationId, projectId, userId, status, labelIds }) => dispatch(listTasks({ organizationId, projectId, userId, status, labelIds })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    signOut: () => dispatch(logOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivatePage)
