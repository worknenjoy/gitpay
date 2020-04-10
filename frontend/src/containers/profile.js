import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { fetchPreferences } from '../actions/preferencesActions'
import { updateUser, deleteUser } from '../actions/userActions'
import { fetchOrganizations, createOrganizations } from '../actions/organizationsActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    preferences: state.preferences,
    organizations: state.organizations.organizations,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    deleteUser: (user) => dispatch(deleteUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
