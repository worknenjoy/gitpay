const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function taskDeleteById (taskParameters) {
  return models.Task.destroy({ where: { id: taskParameters.id } }).catch(error => error)
})
