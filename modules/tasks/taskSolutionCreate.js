const Promise = require('bluebird')
const models = require('../../models')
const taskSolutionFetchData = require('./taskSolutionFetchData')
const taskPayment = require('./taskPayment')
const assignExist = require('../assigns').assignExists

module.exports = Promise.method(async function taskSolutionCreate (taskSolutionParams) {
  const pullRequestURLSplitted = taskSolutionParams.pullRequestURL.split('/')
  const params = {
    pullRequestId: pullRequestURLSplitted[6],
    userId: taskSolutionParams.userId,
    repositoryName: pullRequestURLSplitted[4],
    owner: pullRequestURLSplitted[3],
    taskId: taskSolutionParams.taskId
  }

  const fetchTaskSolutionData = await taskSolutionFetchData(params)
  const task = await models.Task.findOne({
    where: { id: taskSolutionParams.taskId }
  })

  if (fetchTaskSolutionData.isAuthorOfPR && fetchTaskSolutionData.isConnectedToGitHub && fetchTaskSolutionData.isIssueClosed && fetchTaskSolutionData.isPRMerged) {
    if (!task.dataValues.paid && !task.dataValues.transfer_id) {
      const existingAssignment = await assignExist({ userId: taskSolutionParams.userId, taskId: taskSolutionParams.taskId })

      if (!existingAssignment) {
        await task.createAssign({ userId: taskSolutionParams.userId })
      }

      taskPayment({ taskId: task.dataValues.id, value: task.dataValues.value })
    }

    return models.TaskSolution.create(taskSolutionParams).then(data => {
      return data.dataValues
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log(err)

      throw new Error('COULD_NOT_CREATE_TASK_SOLUTION')
    })
  }

  throw new Error('COULD_NOT_CREATE_TASK_SOLUTION')
})
