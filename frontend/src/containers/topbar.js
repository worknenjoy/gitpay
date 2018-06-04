import { connect } from 'react-redux'
import Topbar from '../components/topbar/topbar'
import { addNotification, loggedIn, logOut } from '../actions/actions'

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
      return dispatch(loggedIn())
    },
    signOut: () => {
      return dispatch(logOut())
    },
    addNotification: (msg) => {
      return dispatch(addNotification(msg))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)
