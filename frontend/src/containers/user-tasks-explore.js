import { connect } from 'react-redux'
import UserTasksExplore from '../components/areas/private/features/explore/user-explore-tasks'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: getUserData(state),
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ projectId, userId, status }) => dispatch(listTasks({ projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTasksExplore)
