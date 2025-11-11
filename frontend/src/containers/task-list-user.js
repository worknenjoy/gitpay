import { connect } from 'react-redux'
import { listTasks, filterTasks } from '../actions/taskActions'
import { searchUser } from '../actions/userActions'
import { getFilteredTasks } from '../selectors/tasks'
import ProfilePage from '../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state) => {
  return {
    user: state.user,
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchUser: (params) => dispatch(searchUser(params)),
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
