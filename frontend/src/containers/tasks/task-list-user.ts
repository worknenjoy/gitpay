import { connect } from 'react-redux'
import { listTasks } from '../../actions/taskActions'
import { searchUser } from '../../actions/userActions'
import { getUserProfileStats } from '../../actions/userProfileStatsActions'
import { getPublicPaymentLinksByUser } from '../../actions/paymentLinksPublicActions'
import { getMaintainedProjects } from '../../actions/maintainedProjectsActions'
import ProfilePage from '../../components/areas/public/features/profile/pages/profile-page'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    tasks: state.tasks,
    profileStats: state.userProfileStats,
    paymentLinks: state.paymentLinksPublic,
    maintainedProjects: state.maintainedProjects
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchUser: (params: any) => dispatch(searchUser(params)),
    listTasks: (params: any) => dispatch(listTasks(params)),
    getUserProfileStats: (userId: any) => dispatch(getUserProfileStats(userId)),
    getPublicPaymentLinksByUser: (userId: any) => dispatch(getPublicPaymentLinksByUser(userId)),
    getMaintainedProjects: (userId: any) => dispatch(getMaintainedProjects(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
