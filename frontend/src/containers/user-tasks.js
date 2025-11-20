import { connect } from 'react-redux'
import MyIssuesPage from '../components/areas/private/features/issues/pages/my-issues-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getCurrentUser(state),
    issues: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: (params) => dispatch(listTasks(params)),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIssuesPage)
