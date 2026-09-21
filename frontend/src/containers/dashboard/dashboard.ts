import { connect } from 'react-redux'
import { fetchDashboardInfo } from '../../actions/dashboardActions'
import { addNotification } from '../../actions/notificationActions'
import { fetchAccount } from '../../actions/userActions'
import { listTasks, listMaintainerTasks } from '../../actions/taskActions'
import { listTaskSolutions } from '../../actions/taskSolutionActions'
import { searchPayout } from '../../actions/payoutActions'
import { listPaymentRequests } from '../../actions/paymentRequestActions'
import { listPaymentRequestPayments } from '../../actions/paymentRequestPaymentActions'
import { listProjects } from '../../actions/projectActions'
import { searchTransfer } from '../../actions/transferActions'
import { listOrders } from '../../actions/orderActions'
import Dashboard from '../../components/areas/private/features/dashboard/dashboard'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    dashboard: state.dashboard,
    account: state.account,
    tasks: state.tasks,
    maintainerTasks: state.maintainerTasks,
    taskSolutions: state.taskSolutions,
    payouts: state.payouts,
    paymentRequests: state.paymentRequests,
    paymentRequestPayments: state.paymentRequestPayments,
    projects: state.projects,
    transfers: state.transfers,
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchDashboardInfo: () => dispatch(fetchDashboardInfo()),
    addNotification: (message, options) => dispatch(addNotification(message, options)),
    fetchAccount: () => dispatch(fetchAccount()),
    listTasks: (params) => dispatch(listTasks(params)),
    listMaintainerTasks: (params) => dispatch(listMaintainerTasks(params)),
    listTaskSolutions: () => dispatch(listTaskSolutions()),
    searchPayout: () => dispatch(searchPayout()),
    listPaymentRequests: () => dispatch(listPaymentRequests()),
    listPaymentRequestPayments: () => dispatch(listPaymentRequestPayments()),
    listProjects: (params) => dispatch(listProjects(params)),
    searchTransfer: (params) => dispatch(searchTransfer(params)),
    listOrders: (params) => dispatch(listOrders(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
