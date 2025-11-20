import { connect } from 'react-redux'
import { fetchAccount } from '../actions/userActions'
import {
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  cleanPullRequestDataState,
} from '../actions/taskSolutionActions'
import { getUserData } from '../common/selectors/user/getUser'
import SendSolutionDrawer from '../components/design-library/molecules/drawers/send-solution-drawer/send-solution-drawer'

const mapStateToProps = (state) => {
  return {
    user: getUserData(state),
    account: state.account,
    taskSolution: state.taskSolutionReducer.taskSolution,
    pullRequestData: state.taskSolutionReducer.pullRequestData,
    task: state.task,
    completed: state.taskSolutionReducer.completed,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTaskSolution: (taskId) => dispatch(getTaskSolution(taskId)),
    createTaskSolution: (taskSolution) => dispatch(createTaskSolution(taskSolution)),
    updateTaskSolution: (payload) => dispatch(updateTaskSolution(payload)),
    fetchPullRequestData: (owner, repositoryName, pullRequestId, taskId) =>
      dispatch(fetchPullRequestData(owner, repositoryName, pullRequestId, taskId)),
    cleanPullRequestDataState: () => dispatch(cleanPullRequestDataState()),
    fetchAccount: () => dispatch(fetchAccount()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendSolutionDrawer)
