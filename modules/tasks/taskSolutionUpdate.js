const Promise = require('bluebird')
const models = require('../../models')
const taskSolutionFetchData = require('./taskSolutionFetchData')
const assignExist = require('../assigns').assignExists
const transferBuilds = require('../transfers/transferBuilds')
const taskUpdate = require('../tasks/taskUpdate')

module.exports = Promise.method(async function taskSolutionUpdate (taskSolution, taskSolutionId) {
  try {
    // Update task solution
    const [updatedCount] = await models.TaskSolution.update(taskSolution, {
      where: { id: taskSolutionId }
    })

    if (updatedCount === 0) {
      throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
    }

    // Find task solution by ID
    const taskSolutionInstance = await models.TaskSolution.findOne({
      where: { id: taskSolutionId }
    })

    if (!taskSolutionInstance) {
      throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
    }

    // Find associated task
    const taskData = await models.Task.findOne({
      where: { id: taskSolution.taskId }
    })

    if (!taskData) {
      throw new Error('COULD_NOT_FIND_TASK')
    }

    const pullRequestURLSplitted = taskSolution.pullRequestURL.split('/')

    // Fetch data related to the task solution
    const response = await taskSolutionFetchData({
      pullRequestId: pullRequestURLSplitted[6],
      userId: taskSolution.userId,
      repositoryName: pullRequestURLSplitted[4],
      owner: pullRequestURLSplitted[3],
      taskId: taskSolution.taskId
    })

    // Handle conditions based on fetched data
    if (
      response.isAuthorOfPR &&
      response.isConnectedToGitHub &&
      response.isIssueClosed &&
      response.isPRMerged &&
      response.hasIssueReference
    ) {
      if (!taskData.paid && !taskData.transfer_id) {
        let existingAssignment = await assignExist({ userId: taskSolution.userId, taskId: taskSolution.taskId })

        if (!existingAssignment) {
          existingAssignment = await taskData.createAssign({ userId: taskSolution.userId })

          if (!existingAssignment) {
            throw new Error('COULD_NOT_CREATE_ASSIGN')
          }
        }

        const taskUpdateAssign = await taskUpdate({ id: taskSolution.taskId, assigned: existingAssignment.id })

        if (!taskUpdateAssign) {
          throw new Error('COULD_NOT_UPDATE_TASK')
        }

        const transferSend = await transferBuilds({ taskId: taskData.id, userId: existingAssignment.id })

        if (transferSend.error) {
          throw new Error('TRANSFER_SEND_ERROR')
        }

        return response
      }
    }
    else {
      throw new Error('CONDITIONS_NOT_MET')
    }
  }
  catch (err) {
    // console.error('Error in taskSolutionUpdate:', err.message)
    throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
  }
})
