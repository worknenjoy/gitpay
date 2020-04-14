const models = require('../../models')
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

      if (user.length <= 0) return false

      /* return {
        id: user.dataValues.id,
        website: user.dataValues.website,
        profile_url: user.dataValues.profile_url,
        picture_url: user.dataValues.picture_url,
        name: user.dataValues.name,
        username: user.dataValues.username,
        email: user.dataValues.email,
        provider: user.dataValues.provider,
        account_id: user.dataValues.account_id,
        paypal_id: user.dataValues.paypal_id,
        repos: user.dataValues.repos,
        verifyPassword: user.verifyPassword,
        createdAt: user.dataValues.createdAt,
        updatedAt: user.dataValues.updatedAt
      } */
      return user
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on user exists', error)
      throw error
    })
})
