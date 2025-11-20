import { connect } from 'react-redux'
import { assignTask, removeAssignment, actionAssign } from '../actions/assignActions'
import { updateTask, paymentTask, filterTaskOrders, transferTask } from '../actions/taskActions'
import { createOrder, payOrder } from '../actions/orderActions'
import { getTaskOrdersByFilter } from '../selectors/task'
import { getUserData } from '../common/selectors/user/getUser'
import TaskPayment from '../components/areas/public/features/issue/legacy/task-payment'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn,
    user: getUserData(state),
    task: getTaskOrdersByFilter(state),
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateTask: (task) => dispatch(updateTask(task)),
    assignTask: (taskId, assignId) => dispatch(assignTask(taskId, assignId)),
    actionAssign: (taskId, assignId, action, message) =>
      dispatch(actionAssign(taskId, assignId, action, message)),
    removeAssignment: (id, message) => dispatch(removeAssignment(id, message)),
    paymentTask: (taskId, value) => dispatch(paymentTask(taskId, value)),
    transferTask: (taskId) => dispatch(transferTask(taskId)),
    paymentOrder: (order) => dispatch(payOrder(order)),
    createOrder: (order) => dispatch(createOrder(order)),
    filterTaskOrders: (filter) => dispatch(filterTaskOrders(filter))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPayment)
