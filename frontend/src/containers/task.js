import { connect } from 'react-redux'
import Task from '../components/task/task'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn } from '../actions/loginActions'
import { assignTask, removeAssignment, messageTask, actionAssign } from '../actions/assignActions'
import { updateTask, deleteTask, fetchTask, paymentTask, syncTask, changeTaskTab, filterTaskOrders, inviteTask, fundingInviteTask } from '../actions/taskActions'
import { createOrder, payOrder, cancelOrder, detailOrder } from '../actions/orderActions'
import { getTaskOrdersByFilter } from '../selectors/task'

const mapStateToProps = (state, ownProps) => {
  return {
    completed: state.loggedIn.completed,
    logged: state.loggedIn.logged,
    dialog: state.dialog,
    user: state.loggedIn.user,
    task: getTaskOrdersByFilter(state),
    order: state.order
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    updateTask: (task) => dispatch(updateTask(task)),
    deleteTask: (task) => dispatch(deleteTask(task)),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    addNotification: (message) => dispatch(addNotification(message)),
    assignTask: (taskId, assignId) => dispatch(assignTask(taskId, assignId)),
    actionAssign: (taskId, assignId, action, message) => dispatch(actionAssign(taskId, assignId, action, message)),
    messageTask: (taskId, assignId, message) => dispatch(messageTask(taskId, assignId, message)),
    removeAssignment: (id, message) => dispatch(removeAssignment(id, message)),
    inviteTask: (id, email, message, user) => dispatch(inviteTask(id, email, message, user)),
    fundingInviteTask: (id, email, message, suggestedPrice, suggestedDate, user) => dispatch(fundingInviteTask(id, email, message, suggestedPrice, suggestedDate, user)),
    fetchTask: (taskId) => dispatch(fetchTask(taskId)),
    syncTask: (taskId) => dispatch(syncTask(taskId)),
    paymentTask: (taskId, value) => dispatch(paymentTask(taskId, value)),
    paymentOrder: (order) => dispatch(payOrder(order)),
    changeTab: (tab) => dispatch(changeTaskTab(tab)),
    createOrder: (order) => dispatch(createOrder(order)),
    filterTaskOrders: (filter) => dispatch(filterTaskOrders(filter)),
    cancelPaypalPayment: (id) => dispatch(cancelOrder(id)),
    getOrderDetails: (id) => dispatch(detailOrder(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
