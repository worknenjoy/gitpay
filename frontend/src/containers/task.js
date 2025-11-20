import { connect } from 'react-redux'
import Task from '../components/areas/public/features/issue/pages/issue-public-page'
import { addNotification, addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { info as getInfoAction } from '../actions/infoActions'
import { fetchCustomer, fetchAccount } from '../actions/userActions'
import {
  assignTask,
  removeAssignment,
  messageTask,
  messageOffer,
  offerUpdate,
  actionAssign
} from '../actions/assignActions'
import {
  listTasks,
  filterTasks,
  updateTask,
  deleteTask,
  fetchTask,
  paymentTask,
  syncTask,
  changeTaskTab,
  filterTaskOrders,
  inviteTask,
  fundingInviteTask,
  messageAuthor,
  reportTask,
  requestClaimTask,
  transferTask
} from '../actions/taskActions'
import {
  createOrder,
  payOrder,
  transferOrder,
  cancelOrder,
  detailOrder,
  listOrders
} from '../actions/orderActions'
import { fetchWallet, listWallets } from '../actions/walletActions'
import {
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  cleanPullRequestDataState
} from '../actions/taskSolutionActions'
import { getTaskOrdersByFilter } from '../selectors/task'
import { getFilteredTasks, getProject } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    // Ensure component receives the expected "loggedIn" prop shape
    user: getCurrentUser(state),
    dialog: state.dialog,
    task: getTaskOrdersByFilter(state),
    // For bottom bar props
    info: state.info.data,
    // Added from send-solution-drawer.js
    account: state.account,
    taskSolution: state.taskSolutionReducer.taskSolution,
    pullRequestData: state.taskSolutionReducer.pullRequestData,
    // Preserve existing `task` and `completed` while exposing raw task state and task-solution completion flag
    taskRaw: state.task,
    taskSolutionCompleted: state.taskSolutionReducer.completed,
    tasks: getFilteredTasks(state),
    project: getProject(state.project),
    order: state.order,
    customer: state.customer,
    wallets: state.wallets,
    wallet: state.wallet
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    updateTask: (task) => dispatch(updateTask(task)),
    // Expose the prop name expected by IssuePublicPage
    onDeleteTask: (task) => dispatch(deleteTask(task)),
    // keep original for backwards compatibility where used
    deleteTask: (task) => dispatch(deleteTask(task)),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    addNotification: (message) => dispatch(addNotification(message)),
    assignTask: (taskId, assignId) => dispatch(assignTask(taskId, assignId)),
    actionAssign: (taskId, assignId, action, message) =>
      dispatch(actionAssign(taskId, assignId, action, message)),
    messageTask: (taskId, assignId, message) => dispatch(messageTask(taskId, assignId, message)),
    messageOffer: (taskId, offerId, message) => dispatch(messageOffer(taskId, offerId, message)),
    offerUpdate: (taskId, offerId, { status }) =>
      dispatch(offerUpdate(taskId, offerId, { status })),
    removeAssignment: (id, message) => dispatch(removeAssignment(id, message)),
    inviteTask: (id, email, message, user) => dispatch(inviteTask(id, email, message, user)),
    messageAuthor: (userId, taskId, message) => dispatch(messageAuthor(userId, taskId, message)),
    fundingInviteTask: (id, email, message, suggestedPrice, suggestedDate, user) =>
      dispatch(fundingInviteTask(id, email, message, suggestedPrice, suggestedDate, user)),
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
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
    cancelPaypalPayment: (id) => dispatch(cancelOrder(id)),
    getOrderDetails: (id) => dispatch(detailOrder(id)),
    reportTask: (task, reason) => dispatch(reportTask(task, reason)),
    requestClaimTask: (taskId, userId, comments, isApproved, token, history) =>
      dispatch(requestClaimTask(taskId, userId, comments, isApproved, token, history)),
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
    fetchWallet: (id) => dispatch(fetchWallet(id)),
    listWallets: () => dispatch(listWallets()),
    // Added from send-solution-drawer.js
    getTaskSolution: (taskId) => dispatch(getTaskSolution(taskId)),
    createTaskSolution: (taskSolution) => dispatch(createTaskSolution(taskSolution)),
    updateTaskSolution: (payload) => dispatch(updateTaskSolution(payload)),
    fetchPullRequestData: (owner, repositoryName, pullRequestId, taskId) =>
      dispatch(fetchPullRequestData(owner, repositoryName, pullRequestId, taskId)),
    cleanPullRequestDataState: () => dispatch(cleanPullRequestDataState()),
    fetchAccount: () => dispatch(fetchAccount()),
    // For account menu and bottom bar props
    signOut: () => dispatch(logOut()),
    getInfo: () => dispatch(getInfoAction())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
