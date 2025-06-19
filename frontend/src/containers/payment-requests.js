import { connect } from 'react-redux'
import Payments from '../components/areas/private/features/payments/legacy/payments'
import { addNotification } from '../actions/notificationActions'
import { listTasks, filterTasks, changeTaskTab } from '../actions/taskActions'
import { listOrders, transferOrder, detailOrder, refundOrder, cancelOrder, updateOrder  } from '../actions/orderActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUserData(state),
    paymentRequests: state.paymentRequests,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPaymentRequests: (query) => dispatch(listOrders(query)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)
