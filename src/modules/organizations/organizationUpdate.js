const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function organizationUpdate(organizationParameters) {
  return models.Organization.update(organizationParameters, {
    where: {
      id: organizationParameters.id,
    },
    returning: true,
    plain: true,
  })
    .then((organization) => {
      if (!organization) return false
      return organization[1]
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
