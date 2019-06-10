const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function assignExists (assignAttributes) {
  let whereRules = {}
  if(assignAttributes.id) {
    whereRules.id = assignAttributes.id 
  } else {
    whereRules = {
      userId: assignAttributes.userId,
      TaskId: assignAttributes.taskId
    }
  }
  return models.Assign
    .findOne({
      where: whereRules,
     include: [models.Task, models.User]
    }).then(assign => {
      if (!assign) return false
      return assign
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
