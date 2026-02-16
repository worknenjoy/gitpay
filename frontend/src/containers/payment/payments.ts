import { connect } from 'react-redux'
import Payments from '../../components/areas/private/features/payments/payments'
import { addNotification } from '../../actions/notificationActions'
import { listTasks, filterTasks, changeTaskTab } from '../../actions/taskActions'
import {
  listOrders,
  transferOrder,
  detailOrder,
  refundOrder,
  cancelOrder,
  updateOrder
} from '../../actions/orderActions'
import { getFilteredTasks } from '../../selectors/tasks'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, ownProps?: any) => {
  return {
    user: getCurrentUser(state),
    orders: state.orders,
    order: state.order,
    tasks: getFilteredTasks(state),
    logged: state.loggedIn.logged
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    addNotification: (message: any, options: any) => dispatch(addNotification(message, options)),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional)),
    listTasks: ({ organizationId, projectId, userId, status, labelIds, languageIds }: any) =>
      dispatch(listTasks({ organizationId, projectId, userId, status, labelIds, languageIds })),
    listOrders: (query: any) => dispatch(listOrders(query)),
    getOrderDetails: (id: any) => dispatch(detailOrder(id)),
    refundOrder: (id: any) => dispatch(refundOrder(id)),
    cancelPaypalPayment: (id: any) => dispatch(cancelOrder(id)),
    transferOrder: (order: any, params: any) => dispatch(transferOrder(order, params)),
    updateOrder: (order: any) => dispatch(updateOrder(order)),
    changeTab: (tab: any) => dispatch(changeTaskTab(tab))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)
