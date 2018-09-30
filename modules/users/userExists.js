const models = require('../../loading/loading')
const Promise = require('bluebird')

module.exports = Promise.method(function userExists (userAttributes) {
  return models.User
    .findOne({
      where: {
        email: userAttributes.email
      }
    }).then(user => {
      if (!user) return false

      if (user && !user.dataValues) return false

      if (user && !user.length) return false

      return {
        id: user.dataValues.id,
        name: user.dataValues.name,
        username: user.dataValues.username,
        email: user.dataValues.email,
        provider: user.dataValues.provider,
        account_id: user.dataValues.account_id,
        paypal_id: user.dataValues.paypal_id,
        repos: user.dataValues.repos
      }
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      throw error
    })
})
