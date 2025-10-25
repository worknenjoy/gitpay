const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(function memberExists (roleAttributes) {
  return models.Role
    .findOne({
      where: {
        name: roleAttributes.name
      }
    }).then(role => {
      if (!role) return false
      return role
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error to obtain existent role', error)
      throw error
    })
})
