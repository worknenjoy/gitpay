const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function fetchProject (projectParams) {
  return models.Project.findOne({
    where: {
      id: projectParams.id
    },
    include: [
      {
        model: models.Task,
        include: [models.Project, models.User]
      },
    ]
  })
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('projectFetch', data)
      return data
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})