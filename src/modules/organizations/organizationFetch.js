const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function fetchOrganization(orgParams) {
  return models.Organization.findOne({
    where: {
      id: orgParams.id,
    },
    include: [
      {
        model: models.Project,
        where: null,
        include: [models.Task, models.Organization],
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
