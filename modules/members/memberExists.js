const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function memberExists (memberAttributes) {
  return models.Member
    .findOne({
      where: {
        userId: memberAttributes.userId,
        taskId: memberAttributes.taskId
      }
    }).then(member => {
      if (!member) return false
      return member
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error to obtain existent member', error)
      throw error
    })
})
