const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function userTasks (id) {
  return models.Assign
    .findAll({
      attributes: ['TaskId'],
      where: {
        userId: id
      }
    })
    .then(assigns => {
      return assigns
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error at userTasks', error)
      throw error
    })
})
