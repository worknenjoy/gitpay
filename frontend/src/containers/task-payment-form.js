import { connect } from 'react-redux'
import { fetchCustomer } from '../actions/userActions'
import { updateTask, fetchTask, syncTask } from '../actions/taskActions'
import { createOrder } from '../actions/orderActions'
import { fetchWallet, listWallets } from '../actions/walletActions'
import { getTaskOrdersByFilter } from '../selectors/task'
import { getUserData } from '../common/selectors/user/getUser'
import TaskPaymentForm from '../components/design-library/molecules/drawers/issue-payment-drawer/issue-payment-drawer'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn,
    user: getUserData(state),
    task: getTaskOrdersByFilter(state),
    order: state.order,
    customer: state.customer,
    wallets: state.wallets,
    wallet: state.wallet,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateTask: (task) => dispatch(updateTask(task)),
    fetchTask: (taskId) => dispatch(fetchTask(taskId)),
    syncTask: (taskId) => dispatch(syncTask(taskId)),
    createOrder: (order) => dispatch(createOrder(order)),
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
    fetchWallet: (id) => dispatch(fetchWallet(id)),
    listWallets: () => dispatch(listWallets()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPaymentForm)
