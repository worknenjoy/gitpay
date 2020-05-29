import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { fetchPreferences } from '../actions/preferencesActions'
import { fetchRoles } from '../actions/roleActions'
import { updateUser, deleteUser } from '../actions/userActions'
import { fetchOrganizations, createOrganizations } from '../actions/organizationsActions'

const mapStateToProps = (state, ownProps) => {
  // console.log('state is: ',state)
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
  // console.log('state2 : ',dispatch(fetchPreferences(),dispatch(fetchRoles())))
  return {
    fetchPreferences: (userId) => dispatch(fetchPreferences(userId)),
    // fetchRoles: (userId) => dispatch(fetchRoles(userId)),
    fetchRoles: dispatch(fetchRoles()),
    fetchOrganizations: (userId) => dispatch(fetchOrganizations(userId)),
    createOrganizations: (org) => dispatch(createOrganizations(org)),
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
    deleteUser: (user) => dispatch(deleteUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
