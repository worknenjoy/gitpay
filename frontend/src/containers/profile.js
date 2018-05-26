import { connect } from 'react-redux'
import Profile from '../components/profile/profile'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed
  }
}

export default connect(mapStateToProps)(Profile);
