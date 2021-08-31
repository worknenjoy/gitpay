import { connect } from 'react-redux'
import TaskListUser from '../components/task/task-list-user'
import { getFilteredTasks } from '../selectors/tasks'
import { listTasks } from '../actions/taskActions'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state) => {
  return {
    user: getUser(state),
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListUser)
