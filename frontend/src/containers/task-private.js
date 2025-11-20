import { connect } from 'react-redux'
import IssuePrivatePage from '../components/areas/private/features/issue/pages/issue-private-page'
import { addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn } from '../actions/loginActions'
import { fetchCustomer, fetchAccount } from '../actions/userActions'
import {
  assignTask,
  removeAssignment,
  messageTask,
  messageOffer,
  offerUpdate,
  actionAssign,
} from '../actions/assignActions'
import {
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
  transferTask,
} from '../actions/taskActions'
import {
  createOrder,
  payOrder,
  transferOrder,
  cancelOrder,
  detailOrder,
  listOrders,
} from '../actions/orderActions'
import { fetchWallet, listWallets } from '../actions/walletActions'
import {
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  cleanPullRequestDataState,
} from '../actions/taskSolutionActions'
import { getTaskOrdersByFilter } from '../selectors/task'
import { getProject } from '../selectors/tasks'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn,
    dialog: state.dialog,
    task: getTaskOrdersByFilter(state),
    // For bottom bar props
    // Added from send-solution-drawer.js
    account: state.account,
    taskSolution: state.taskSolutionReducer.taskSolution,
    pullRequestData: state.taskSolutionReducer.pullRequestData,
    // Preserve existing `task` and `completed` while exposing raw task state and task-solution completion flag
    taskRaw: state.task,
    taskSolutionCompleted: state.taskSolutionReducer.completed,
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
    // Expose the prop name expected by IssuePublicPage
    onDeleteTask: (task) => dispatch(deleteTask(task)),
    // keep original for backwards compatibility where used
    deleteTask: (task) => dispatch(deleteTask(task)),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    // addNotification provided by profile container
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
    // listTasks and filterTasks provided by profile container
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
    // signOut and getInfo provided by profile container
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuePrivatePage)
