/* eslint-disable no-console */
import { connect } from 'react-redux'
import TaskList from '../components/task/task-list'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks, getUser } from '../selectors/tasks'

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: () => dispatch(listTasks()),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
