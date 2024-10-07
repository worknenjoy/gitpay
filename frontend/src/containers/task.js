import { connect } from 'react-redux'
import Task from '../components/task/task'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn } from '../actions/loginActions'
import { fetchCustomer } from '../actions/userActions'
import { assignTask, removeAssignment, messageTask, messageOffer, offerUpdate, actionAssign } from '../actions/assignActions'
import { listTasks, filterTasks, updateTask, deleteTask, fetchTask, paymentTask, syncTask, changeTaskTab, filterTaskOrders, inviteTask, fundingInviteTask, messageAuthor, reportTask, requestClaimTask, transferTask } from '../actions/taskActions'
import { createOrder, payOrder, transferOrder, cancelOrder, detailOrder, listOrders } from '../actions/orderActions'
import { fetchWallet, listWallets } from '../actions/walletActions'
import { getTaskOrdersByFilter } from '../selectors/task'
import { getFilteredTasks, getProject } from '../selectors/tasks'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    completed: state.loggedIn.completed,
    logged: state.loggedIn,
    dialog: state.dialog,
    user: getUser(state),
    task: getTaskOrdersByFilter(state),
    tasks: getFilteredTasks(state),
    project: getProject(state.project),
    order: state.order,
    customer: state.customer,
    wallets: state.wallets,
    wallet: state.wallet,
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
    messageOffer: (taskId, offerId, message) => dispatch(messageOffer(taskId, offerId, message)),
    offerUpdate: (taskId, offerId, { status }) => dispatch(offerUpdate(taskId, offerId, { status })),
    removeAssignment: (id, message) => dispatch(removeAssignment(id, message)),
    inviteTask: (id, email, message, user) => dispatch(inviteTask(id, email, message, user)),
    messageAuthor: (userId, taskId, message) => dispatch(messageAuthor(userId, taskId, message)),
    fundingInviteTask: (id, email, message, suggestedPrice, suggestedDate, user) => dispatch(fundingInviteTask(id, email, message, suggestedPrice, suggestedDate, user)),
    fetchTask: (taskId) => dispatch(fetchTask(taskId)),
    syncTask: (taskId) => dispatch(syncTask(taskId)),
    paymentTask: (taskId, value) => dispatch(paymentTask(taskId, value)),
    transferTask: (taskId) => dispatch(transferTask(taskId)),
    paymentOrder: (order) => dispatch(payOrder(order)),
    changeTab: (tab) => dispatch(changeTaskTab(tab)),
    createOrder: (order) => dispatch(createOrder(order)),
    listOrders: (query) => dispatch(listOrders(query)),
    filterTaskOrders: (filter) => dispatch(filterTaskOrders(filter)),
    transferOrder: (order, params) => dispatch(transferOrder(order, params)),
    listTasks: () => dispatch(listTasks()),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    cancelPaypalPayment: (id) => dispatch(cancelOrder(id)),
    getOrderDetails: (id) => dispatch(detailOrder(id)),
    reportTask: (task, reason) => dispatch(reportTask(task, reason)),
    requestClaimTask: (taskId, userId, comments, isApproved, token, history) => dispatch(requestClaimTask(taskId, userId, comments, isApproved, token, history)),
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
    fetchWallet: (id) => dispatch(fetchWallet(id)),
    listWallets: () => dispatch(listWallets()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
