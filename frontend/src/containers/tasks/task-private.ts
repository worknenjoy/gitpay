import { connect } from 'react-redux'
import IssuePrivatePage from '../../components/areas/private/features/issue/pages/issue-private-page'
import { addDialog, closeDialog } from '../../actions/notificationActions'
import { loggedIn } from '../../actions/loginActions'
import { fetchCustomer, fetchAccount } from '../../actions/userActions'
import {
  assignTask,
  removeAssignment,
  messageTask,
  messageOffer,
  offerUpdate,
  actionAssign
} from '../../actions/assignActions'
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
  transferTask
} from '../../actions/taskActions'
import {
  createOrder,
  payOrder,
  transferOrder,
  cancelOrder,
  detailOrder,
  listOrders
} from '../../actions/orderActions'
import { fetchWallet, listWallets } from '../../actions/walletActions'
import {
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  cleanPullRequestDataState
} from '../../actions/taskSolutionActions'
import { getTaskOrdersByFilter } from '../../selectors/task'
import { getProject } from '../../selectors/tasks'

const mapStateToProps = (state: any, ownProps?: any) => {
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
    wallet: state.wallet
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    updateTask: (task: any) => dispatch(updateTask(task)),
    // Expose the prop name expected by IssuePublicPage
    onDeleteTask: (task: any) => dispatch(deleteTask(task)),
    // keep original for backwards compatibility where used
    deleteTask: (task: any) => dispatch(deleteTask(task)),
    openDialog: (target: any) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    // addNotification provided by profile container
    assignTask: (taskId: any, assignId: any) => dispatch(assignTask(taskId, assignId)),
    actionAssign: (taskId: any, assignId: any, action: any, message: any) =>
      dispatch(actionAssign(taskId, assignId, action, message)),
    messageTask: (taskId: any, assignId: any, message: any) =>
      dispatch(messageTask(taskId, assignId, message)),
    messageOffer: (taskId: any, offerId: any, message: any) =>
      dispatch(messageOffer(taskId, offerId, message)),
    offerUpdate: (taskId: any, offerId: any, { status }: any) =>
      dispatch(offerUpdate(taskId, offerId, { status })),
    removeAssignment: (id: any, message: any) => dispatch(removeAssignment(id, message)),
    inviteTask: (id: any, email: any, message: any, user: any) =>
      dispatch(inviteTask(id, email, message, user)),
    messageAuthor: (userId: any, taskId: any, message: any) =>
      dispatch(messageAuthor(userId, taskId, message)),
    fundingInviteTask: (
      id: any,
      email: any,
      message: any,
      suggestedPrice: any,
      suggestedDate: any,
      user: any
    ) => dispatch(fundingInviteTask(id, email, message, suggestedPrice, suggestedDate, user)),
    fetchTask: (taskId: any) => dispatch(fetchTask(taskId)),
    syncTask: (taskId: any) => dispatch(syncTask(taskId)),
    paymentTask: (taskId: any, value: any) => dispatch(paymentTask(taskId, value)),
    transferTask: (taskId: any) => dispatch(transferTask(taskId)),
    paymentOrder: (order: any) => dispatch(payOrder(order)),
    changeTab: (tab: any) => dispatch(changeTaskTab(tab)),
    createOrder: (order: any) => dispatch(createOrder(order)),
    listOrders: (query: any) => dispatch(listOrders(query)),
    filterTaskOrders: (filter: any) => dispatch(filterTaskOrders(filter)),
    transferOrder: (order: any, params: any) => dispatch(transferOrder(order, params)),
    // listTasks and filterTasks provided by profile container
    cancelPaypalPayment: (id: any) => dispatch(cancelOrder(id)),
    getOrderDetails: (id: any) => dispatch(detailOrder(id)),
    reportTask: (task: any, reason: any) => dispatch(reportTask(task, reason)),
    requestClaimTask: (
      taskId: any,
      userId: any,
      comments: any,
      isApproved: any,
      token: any,
      history: any
    ) => dispatch(requestClaimTask(taskId, userId, comments, isApproved, token, history)),
    fetchCustomer: () => dispatch(fetchCustomer()),
    fetchWallet: (id: any) => dispatch(fetchWallet(id)),
    listWallets: () => dispatch(listWallets()),
    // Added from send-solution-drawer.js
    getTaskSolution: (taskId: any) => dispatch(getTaskSolution(taskId)),
    createTaskSolution: (taskSolution: any) => dispatch(createTaskSolution(taskSolution)),
    updateTaskSolution: (payload: any) => dispatch(updateTaskSolution(payload)),
    fetchPullRequestData: (owner: any, repositoryName: any, pullRequestId: any, taskId: any) =>
      dispatch(fetchPullRequestData(owner, repositoryName, pullRequestId, taskId)),
    cleanPullRequestDataState: () => dispatch(cleanPullRequestDataState()),
    fetchAccount: () => dispatch(fetchAccount())
    // For account menu and bottom bar props
    // signOut and getInfo provided by profile container
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuePrivatePage)
