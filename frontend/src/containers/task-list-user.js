import { connect } from 'react-redux'
import TaskListUser from '../components/areas/public/features/task/task-list-user'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state) => {
  return {
    user: getUserData(state),
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListUser)
