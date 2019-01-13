const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function taskDeleteById (taskParameters) {
  return models.Task.destroy({
    where: {
      id: taskParameters.id,
      userId: taskParameters.userId,
    }
  }).catch(error => error)
})
