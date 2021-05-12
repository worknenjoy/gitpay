import { connect } from 'react-redux'
import SendSolutionDialog from '../components/task/send-solution-dialog'
import { getTaskSolution, createTaskSolution, updateTaskSolution, fetchPullRequestData, cleanPullRequestDataState } from '../actions/taskSolutionActions'

const mapStateToProps = state => {
  return {
    user: state.loggedIn.user,
    taskSolution: state.taskSolutionReducer.taskSolution,
    pullRequestData: state.taskSolutionReducer.pullRequestData,
    completed: state.taskSolutionReducer.completed
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTaskSolution: (userId, taskId) => dispatch(getTaskSolution(userId, taskId)),
    createTaskSolution: (taskSolution) => dispatch(createTaskSolution(taskSolution)),
    updateTaskSolution: (taskSolutionId, pullRequestURL) => dispatch(updateTaskSolution(taskSolutionId, pullRequestURL)),
    fetchPullRequestData: (owner, repositoryName, pullRequestId, userId, taskId) => dispatch(
      fetchPullRequestData(owner, repositoryName, pullRequestId, userId, taskId)
    ),
    cleanPullRequestDataState: () => dispatch(cleanPullRequestDataState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendSolutionDialog)
