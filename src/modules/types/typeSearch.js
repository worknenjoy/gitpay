const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function typeSearch(typeParameters) {
  return models.Type.findAll({})
    .then((type) => {
      return type
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
