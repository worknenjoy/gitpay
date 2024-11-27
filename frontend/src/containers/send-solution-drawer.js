import { connect } from 'react-redux'
import { fetchAccount } from '../actions/userActions'
import { getTaskSolution, createTaskSolution, updateTaskSolution, fetchPullRequestData, cleanPullRequestDataState } from '../actions/taskSolutionActions'
import { getUser } from '../common/selectors/user/getUser'
import SendSolutionDrawer from '../components/task/components/send-solution-drawer'

const mapStateToProps = state => {
  return {
    user: getUser(state),
    account: state.account,
    taskSolution: state.taskSolutionReducer.taskSolution,
    pullRequestData: state.taskSolutionReducer.pullRequestData,
    task: state.task,
    completed: state.taskSolutionReducer.completed
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTaskSolution: (userId, taskId) => dispatch(getTaskSolution(userId, taskId)),
    createTaskSolution: (taskSolution) => dispatch(createTaskSolution(taskSolution)),
    updateTaskSolution: (payload) => dispatch(updateTaskSolution(payload)),
    fetchPullRequestData: (owner, repositoryName, pullRequestId, userId, taskId) => dispatch(
      fetchPullRequestData(owner, repositoryName, pullRequestId, userId, taskId)
    ),
    cleanPullRequestDataState: () => dispatch(cleanPullRequestDataState()),
    fetchAccount: () => dispatch(fetchAccount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendSolutionDrawer)
