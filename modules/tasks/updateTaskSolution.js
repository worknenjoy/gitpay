const Promise = require('bluebird')
const models = require('../../models')
const taskSolutionFetchData = require('./taskSolutionFetchData')
const taskPayment = require('./taskPayment')

module.exports = Promise.method(function updateTaskSolution (taskSolution, taskSolutionId) {
  return models.TaskSolution.update(taskSolution, {
    where: { id: taskSolutionId }
  }).then(data => {
    if (!data) {
      return new Error('Task Solution update failed.')
    }

    if (data) {
      models.Task.findOne({
        where: { id: taskSolution.taskId }
      }).then(taskData => {
        const pullRequestURLSplitted = taskSolution.pullRequestURL.split('/')

        taskSolutionFetchData({
          pullRequestId: pullRequestURLSplitted[6],
          userId: taskSolution.userId,
          repositoryName: pullRequestURLSplitted[4],
          owner: pullRequestURLSplitted[3],
          taskId: taskSolution.taskId
        }).then(response => {
          if (response.isAuthorOfPR && response.isConnectedToGitHub && response.isIssueClosed && response.isPRMerged) {
            if (!taskData.dataValues.paid) {
              taskPayment({ taskId: taskData.dataValues.id, value: taskData.dataValues.value })
            }
          }
        })
      })
    }

    return models.TaskSolution.findOne({
      where: { id: taskSolutionId }
    })
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.log(err)
    throw err
  })
})
