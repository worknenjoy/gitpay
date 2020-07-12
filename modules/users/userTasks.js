const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function userTasks (id) {
  return models.Assign
    .findAll({
      attributes: ['TaskId'],
      where: {
        userId: id,
        status: 'accepted'
      }
    }).then(assigns => {
      return assigns.map(a => {
        return models.Task
          .findOne({
            attributes: ['id'],
            where: {
              id: a.dataValues.TaskId,
              status: 'closed'
            }
          }).then(res => {
            return res.dataValues
          })
      })
    }).all().then(res => res)
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error at userTasks', error)
      throw error
    })
})
