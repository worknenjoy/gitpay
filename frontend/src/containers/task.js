import { connect } from 'react-redux'
import Task from '../components/task/task'
import { addNotification, addDialog, closeDialog, loggedIn, updateTask } from '../actions/actions'
import { assignTask } from '../actions/assignActions'

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
    addNotification: (message) => dispatch(addNotification(message)),
    assignTask: (taskId, assignId) => dispatch(assignTask(taskId, assignId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
