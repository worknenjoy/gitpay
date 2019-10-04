const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskDeleteById (taskParameters) {
  return Promise.all([
    models.History.destroy({ where: { TaskId: taskParameters.id } }),
    models.Order.destroy({ where: { TaskId: taskParameters.id } }),
    models.Assign.destroy({ where: { TaskId: taskParameters.id } }),
    models.Offer.destroy({ where: { taskId: taskParameters.id } }),
    models.Member.destroy({ where: { taskId: taskParameters.id } }),
  ]).then(result => {
    // eslint-disable-next-line no-console
    console.log('result from delete dependencies', result)
    return models.Task.destroy({
      where: {
        id: taskParameters.id,
        userId: taskParameters.userId
      }
    }).then(task => {
      // eslint-disable-next-line no-console
      console.log('destroy', task)
      return task
    })
  })
})
