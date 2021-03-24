import { connect } from 'react-redux'
import Payments from '../components/profile/payments'
import { addNotification } from '../actions/notificationActions'
import { listTasks, filterTasks, changeTaskTab } from '../actions/taskActions'
import { listOrders, transferOrder, detailOrder, refundOrder, cancelOrder } from '../actions/orderActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn.user,
    orders: state.orders,
    order: state.order,
    tasks: getFilteredTasks(state),
    logged: state.loggedIn.logged
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message) => dispatch(addNotification(message)),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    listOrders: (query) => dispatch(listOrders(query)),
    getOrderDetails: (id) => dispatch(detailOrder(id)),
    refundOrder: (id) => dispatch(refundOrder(id)),
    cancelPaypalPayment: (id) => dispatch(cancelOrder(id)),
    transferOrder: (order, params) => dispatch(transferOrder(order, params)),
    changeTab: (tab) => dispatch(changeTaskTab(tab))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)
