const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function taskExists (taskAttributes) {
  return models.Task
    .findOne({
      where: {
        id: taskAttributes.id
      }
    }).then(task => {
      if (!task) return false
      return task
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
