const Promise = require('bluebird')
const models = require('../../loading/loading')

module.exports = Promise.method(function userSearch () {
  return models.User
    .findAll(
      {}
    )
    .then(user => {
      if (!user) return false

      if (user && !user.dataValues) return false

      if (user && !user.length) return false

      return {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email
      }
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
