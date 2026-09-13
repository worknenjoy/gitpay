import { connect } from 'react-redux'
import { listTasks, listMaintainerOpenBounties } from '../../actions/taskActions'
import { searchUser } from '../../actions/userActions'
import { listPublicTaskSolutions } from '../../actions/taskSolutionActions'
import { listPublicPaymentRequests } from '../../actions/paymentRequestActions'
import { listProjects } from '../../actions/projectActions'
import ProfilePage from '../../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    tasks: state.tasks,
    pullRequests: state.publicTaskSolutions,
    paymentLinks: state.publicPaymentRequests,
    maintainerProjects: state.projects,
    maintainerOpenBounties: state.maintainerOpenBounties
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchUser: (params: any) => dispatch(searchUser(params)),
    listTasks: (params: any) => dispatch(listTasks(params)),
    listPublicTaskSolutions: (userId: number) => dispatch(listPublicTaskSolutions(userId)),
    listPublicPaymentRequests: (userId: number) => dispatch(listPublicPaymentRequests(userId)),
    listMaintainerProjects: (userId: number) => dispatch(listProjects({ userId })),
    listMaintainerOpenBounties: (organizationId: number) =>
      dispatch(listMaintainerOpenBounties(organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
