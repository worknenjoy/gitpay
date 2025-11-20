const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function fetchProject(projectParams, params) {
  return models.Project.findOne({
    where: {
      id: projectParams.id,
    },
    include: [
      {
        model: models.Task,
        where: params || null,
        include: [models.Project, models.User, models.Assign],
      },
      models.Organization,
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
