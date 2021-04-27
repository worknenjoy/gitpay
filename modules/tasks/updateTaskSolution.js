const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function updateTaskSolution (taskSolution, taskSolutionId) {
  return models.TaskSolution.update(taskSolution, {
    where: { id: taskSolutionId }
  }).then(data => {
    if (!data) {
      return new Error('Task Solution update failed.')
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
