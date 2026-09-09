import { connect } from 'react-redux'
import { listTasks } from '../../actions/taskActions'
import { searchUser } from '../../actions/userActions'
import { listPublicTaskSolutions } from '../../actions/taskSolutionActions'
import { listPublicPaymentRequests } from '../../actions/paymentRequestActions'
import ProfilePage from '../../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    tasks: state.tasks,
    pullRequests: state.publicTaskSolutions,
    paymentLinks: state.publicPaymentRequests
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchUser: (params: any) => dispatch(searchUser(params)),
    listTasks: (params: any) => dispatch(listTasks(params)),
    listPublicTaskSolutions: (userId: number) => dispatch(listPublicTaskSolutions(userId)),
    listPublicPaymentRequests: (userId: number) => dispatch(listPublicPaymentRequests(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
