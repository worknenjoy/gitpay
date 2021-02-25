import { connect } from 'react-redux'
import UserTasks from '../components/profile/user-tasks'
import { getFilteredTasks, listTasks, filterTasks } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ projectId, userId, status }) => dispatch(listTasks({ projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTasks)
