const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function getTaskSolution (taskId, userId) {
  return models.TaskSolution.findOne({
    where: { taskId: taskId, userId: userId }
  }).then(data => {
    return data
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.log(err)
    return {}
  })
})
