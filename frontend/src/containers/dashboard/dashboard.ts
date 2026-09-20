import { connect } from 'react-redux'
import { fetchDashboardInfo } from '../../actions/dashboardActions'
import { addNotification } from '../../actions/notificationActions'
import { fetchAccount } from '../../actions/userActions'
import { listTasks } from '../../actions/taskActions'
import { listTaskSolutions } from '../../actions/taskSolutionActions'
import { searchPayout } from '../../actions/payoutActions'
import Dashboard from '../../components/areas/private/features/dashboard/dashboard'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    dashboard: state.dashboard,
    account: state.account,
    tasks: state.tasks,
    taskSolutions: state.taskSolutions,
    payouts: state.payouts
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchDashboardInfo: () => dispatch(fetchDashboardInfo()),
    addNotification: (message, options) => dispatch(addNotification(message, options)),
    fetchAccount: () => dispatch(fetchAccount()),
    listTasks: (params) => dispatch(listTasks(params)),
    listTaskSolutions: () => dispatch(listTaskSolutions()),
    searchPayout: () => dispatch(searchPayout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
