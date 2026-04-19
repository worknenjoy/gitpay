import { connect } from 'react-redux'
import { listTasks } from '../../actions/taskActions'
import { searchUser } from '../../actions/userActions'
import ProfilePage from '../../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    tasks: state.tasks
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchUser: (params: any) => dispatch(searchUser(params)),
    listTasks: (params: any) => dispatch(listTasks(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
