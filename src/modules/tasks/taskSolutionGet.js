const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSolutionGet(taskId, userId) {
  return models.TaskSolution.findOne({
    where: { taskId: taskId, userId: userId },
  })
    .then((data) => {
      if (!data) {
        return {}
      }

      return data
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)

      throw new Error('COULD_NOT_GET_TASK_SOLUTION')
    })
})
