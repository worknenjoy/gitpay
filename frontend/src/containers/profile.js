import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { fetchPreferences } from '../actions/preferencesActions'
import { updateUser } from '../actions/userActions'
import { fetchOrganizations } from '../actions/organizationsActions'

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
    updateUser: (userId, userData) => dispatch(updateUser(userId, userData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
