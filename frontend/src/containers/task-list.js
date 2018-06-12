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
    filterTasks: (key, value) => dispatch(filterTasks(key, value))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
