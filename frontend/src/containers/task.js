import { connect } from 'react-redux'
import Task from '../components/task/task'
import { addNotification, addDialog, closeDialog, loggedIn, updateTask } from '../actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    dialog: state.dialog.open,
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
    },
    openDialog: () => dispatch(addDialog()),
    closeDialog: () => dispatch(closeDialog()),
    addNotification: (message) => dispatch(addNotification(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
