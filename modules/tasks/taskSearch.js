const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSearch (projectId) {
  return models.Task
    .findAll(
      {
        where: projectId ? { ProjectId: projectId } : {},
        include: [ models.User, models.Order, models.Assign, models.Label, models.Project ],
        order: [
          ['status', 'DESC'],
          ['id', 'DESC']
        ]
      }
    )
    .then(data => {
      return data
    })
})
