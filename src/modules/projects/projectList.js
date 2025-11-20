const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function listProjects() {
  return models.Project.findAll({
    include: [
      models.Organization,
      {
        model: models.Task,
        include: [models.User]
      }
    ]
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
