import { connect } from 'react-redux'
import { listTasks, filterTasks } from '../../actions/taskActions'
import { searchUser } from '../../actions/userActions'
import { getFilteredTasks } from '../../selectors/tasks'
import ProfilePage from '../../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    tasks: getFilteredTasks(state)
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchUser: (params: any) => dispatch(searchUser(params)),
    listTasks: ({ organizationId, projectId, userId, status, labelIds, languageIds }: any) =>
      dispatch(listTasks({ organizationId, projectId, userId, status, labelIds, languageIds })),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
