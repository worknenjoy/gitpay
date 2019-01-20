const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function offerExists (offerAttributes) {
  return models.Offer
    .findOne({
      where: {
        userId: offerAttributes.userId,
        taskId: offerAttributes.taskId
      }
    }).then(offer => {
      if (!offer) return false
      return offer
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
