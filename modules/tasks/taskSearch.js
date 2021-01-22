const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSearch (projectId) {
  let query = { private: false }
  return models.Task
    .findAll(
      {
        where: projectId ? { ...query, ProjectId: projectId } : query,
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
