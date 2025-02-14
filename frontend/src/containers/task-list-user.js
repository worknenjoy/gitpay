import { connect } from 'react-redux'
import TaskListUser from '../components/areas/public/features/task/task-list-user'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state) => {
  return {
    user: getUser(state),
    tasks: getFilteredTasks(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListUser)
