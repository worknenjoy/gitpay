import { connect } from 'react-redux'
import Task from '../components/task/task'
import { loggedIn, updateTask } from '../actions/actions'

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
      dispatch(loggedIn());
    },
    updateTask: (task) => {
      dispatch(updateTask(task));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
