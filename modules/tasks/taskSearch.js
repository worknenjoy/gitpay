const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSearch (projectId) {
<<<<<<< HEAD
  let query = { private: false }
=======
  let query = { $or: [
    { private: null },
    { private: false }
  ] }
>>>>>>> 23dcce1... fixing private query
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
