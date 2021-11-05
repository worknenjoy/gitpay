const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(async function userTypes (userId) {
  return models.User
    .findOne({
      where: {
        id: userId
      },
      include: [
        models.Type
      ]
    }).then(async user => {
      if (!user) {
        return {}
      }

      return user
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on user types', error)
      throw error
    })
})
