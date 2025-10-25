const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function assignExists (assignAttributes) {
  return models.Assign
    .findOne({
      where: {
        userId: assignAttributes.userId,
        TaskId: assignAttributes.taskId
      }
    }).then(assign => {
      if (!assign) return false
      return assign
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
