import { connect } from 'react-redux'
import TaskListUser from '../components/task/task-list-user'
import { listTasks, filterTasks } from '../actions/taskActions'
import { listOrders } from '../actions/orderActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state) => {
  return {
    tasks: getFilteredTasks(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    listTasksFromOrders: (query) => dispatch(listOrders(query)),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListUser)
