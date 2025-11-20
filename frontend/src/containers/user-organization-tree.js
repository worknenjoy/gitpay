import { connect } from 'react-redux'
import UserOrganizationTree from '../components/areas/private/features/organizations/user-organization-tree'
import { listTasks } from '../actions/taskActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: getUserData(state),
    tasks: state.tasks
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ projectId, userId }) => dispatch(listTasks({ projectId, userId }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationTree)
