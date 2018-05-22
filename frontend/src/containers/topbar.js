import { connect } from 'react-redux'
import Topbar from '../components/topbar/topbar'
import { loggedIn, logOut } from '../actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => {
      dispatch(loggedIn())
    },
    signOut: () => {
      dispatch(logOut())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)
