import { connect } from 'react-redux'
import TaskList from '../components/task/task-list'
import { listTasks, filterTasks } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn.user,
    tasks: state.tasks
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: () => dispatch(listTasks()),
    filterTasks: (tasks, key, value) => dispatch(filterTasks(tasks, key, value))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
