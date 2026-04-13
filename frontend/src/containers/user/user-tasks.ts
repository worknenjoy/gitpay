import { connect } from 'react-redux'
import MyIssuesPage from '../../components/areas/private/features/issues/pages/my-issues-page'
import { listTasks, filterTasks } from '../../actions/taskActions'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, ownProps?: any) => {
  return {
    user: getCurrentUser(state),
    issues: state.tasks
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    listTasks: (params: any) => dispatch(listTasks(params)),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIssuesPage)
