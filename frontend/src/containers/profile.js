import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { fetchPreferences } from '../actions/preferencesActions'
import { fetchRoles, updateRoles } from '../actions/userRoleActions'
import { updateUser, deleteUser } from '../actions/userActions'
import { fetchOrganizations, createOrganizations } from '../actions/organizationsActions'
import { addNotification, closeNotification } from '../actions/notificationActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    preferences: state.preferences,
    roles: state.roles,
    organizations: state.organizations.organizations,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    fetchRoles: dispatch(fetchRoles()),
    updateRoles: (rolesData) => dispatch(updateRoles(rolesData)),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    deleteUser: (user) => dispatch(deleteUser(user)),
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: (message) => dispatch(closeNotification(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
