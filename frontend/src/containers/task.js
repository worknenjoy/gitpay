import { connect } from 'react-redux'
import Task from '../components/task/task'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn } from '../actions/loginActions'
import { assignTask } from '../actions/assignActions'
import { updateTask, fetchTask, paymentTask, syncTask, changeTaskTab, filterTaskOrders } from '../actions/taskActions'
import { createOrder, payOrder } from '../actions/orderActions'
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
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    addNotification: (message) => dispatch(addNotification(message)),
    assignTask: (taskId, assignId) => dispatch(assignTask(taskId, assignId)),
    fetchTask: (taskId) => dispatch(fetchTask(taskId)),
    syncTask: (taskId) => dispatch(syncTask(taskId)),
    paymentTask: (taskId, value) => dispatch(paymentTask(taskId, value)),
    paymentOrder: (order) => dispatch(payOrder(order)),
    changeTab: (tab) => dispatch(changeTaskTab(tab)),
    createOrder: (order) => dispatch(createOrder(order)),
    filterTaskOrders: (filter) => dispatch(filterTaskOrders(filter))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
