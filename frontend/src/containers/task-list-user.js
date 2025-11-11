import { connect } from 'react-redux'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'
import ProfilePage from '../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state) => {
  return {
    user: getCurrentUser(state),
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
