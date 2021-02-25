import { connect } from 'react-redux'
import UserOrganizationTree from '../components/profile/user-organization-tree'
import { listTasks } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    tasks: state.tasks
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ projectId, userId }) => dispatch(listTasks({ projectId, userId }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationTree)
