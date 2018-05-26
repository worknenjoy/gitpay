import { connect } from 'react-redux'
import Task from '../components/task/task'
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
