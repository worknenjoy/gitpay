const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function listOrganizations() {
  return models.Organization.findAll({
    include: [
      {
        model: models.Project,
        include: [models.Organization],
      },
      {
        model: models.User,
      },
    ],
  })
    .then((data) => {
      return data
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
