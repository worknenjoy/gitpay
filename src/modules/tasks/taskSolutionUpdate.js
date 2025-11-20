const Promise = require('bluebird')
const models = require('../../models')
const taskSolutionFetchData = require('./taskSolutionFetchData')
const assignExist = require('../assigns').assignExists
const transferBuilds = require('../transfers/transferBuilds')
const taskUpdate = require('../tasks/taskUpdate')

module.exports = Promise.method(function taskSolutionUpdate(taskSolution, taskSolutionId) {
  return models.TaskSolution.update(taskSolution, {
    where: { id: taskSolutionId }
  })
    .then((data) => {
      if (!data) {
        throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
      }

      if (data) {
        return models.Task.findOne({
          where: { id: taskSolution.taskId }
        }).then((taskData) => {
          const pullRequestURLSplitted = taskSolution.pullRequestURL.split('/')

          return taskSolutionFetchData({
            pullRequestId: pullRequestURLSplitted[6],
            userId: taskSolution.userId,
            repositoryName: pullRequestURLSplitted[4],
            owner: pullRequestURLSplitted[3],
            taskId: taskSolution.taskId
          })
            .then(async (response) => {
              const taskSolutionUpdate = await models.TaskSolution.update(response, {
                where: { id: taskSolutionId },
                returning: true,
                plain: true
              })
              if (
                response.isAuthorOfPR &&
                response.isConnectedToGitHub &&
                response.isIssueClosed &&
                response.isPRMerged &&
                response.hasIssueReference
              ) {
                if (!taskData.dataValues.paid && !taskData.dataValues.transfer_id) {
                  //taskPayment({ taskId: taskData.dataValues.id, value: taskData.dataValues.value })
                  let existingAssignment = await assignExist({
                    userId: taskSolution.userId,
                    taskId: taskSolution.taskId
                  })
                  if (!existingAssignment) {
                    existingAssignment = await taskData.createAssign({
                      userId: taskSolution.userId
                    })
                    if (!existingAssignment) {
                      throw new Error('COULD_NOT_CREATE_ASSIGN')
                    }
                  }
                  const taskUpdateAssign = await taskUpdate(
                    {
                      id: taskSolution.taskId,
                      userId: taskData.dataValues.userId,
                      assigned: existingAssignment.dataValues.id
                    },
                    false
                  )
                  if (!taskUpdateAssign) {
                    throw new Error('COULD_NOT_UPDATE_TASK')
                  }
                  const transferSend = await transferBuilds({
                    taskId: taskData.dataValues.id,
                    userId: existingAssignment.dataValues.id
                  })
                  if (transferSend.error) {
                    throw new Error('transferSend.error')
                  }
                  return response
                }
              } else {
                throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
              }
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.log(err)
              throw err
            })
        })
      }

      return models.TaskSolution.findOne({
        where: { id: taskSolutionId }
      })
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)

      throw new Error('COULD_NOT_UPDATE_TASK_SOLUTION')
    })
})
