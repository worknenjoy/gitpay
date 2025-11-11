const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userSearch (params) {
  return models.User
    .findAll(
      {
        where: params || {},
        attributes: ['id', 'website', 'profile_url', 'picture_url', 'name', 'username', 'email', 'provider', 'account_id', 'paypal_id', 'repos', 'createdAt', 'updatedAt'],
        include: [
          models.Type
        ]
      }
    )
    .then(users => {
      if (!users) return false

      if (users.length <= 0) return false

      return users
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
