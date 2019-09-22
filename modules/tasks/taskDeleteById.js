const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskDeleteById (taskParameters) {
  return models.Task.destroy({
    where: {
      id: taskParameters.id,
      userId: taskParameters.userId,
    },
    truncate: false,
    cascade: true
  }).then(task => {
    // eslint-disable-next-line no-console
    console.log('destroy', task)
    return task
  })
})
