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
    let conditions = {
      id: taskParameters.id
    }
    if (taskParameters.userId) {
      conditions = { ...conditions, userId: taskParameters.userId }
    }
    return models.Task.destroy({
      where: conditions
    }).then(task => { 
      return task
    })
  })
})
