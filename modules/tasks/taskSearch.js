const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function taskSearch (searchParams) {
  let query = { $or: [
    { private: null },
    { private: false }
  ] }

  query = searchParams.projectId ? { ...query, ProjectId: searchParams.projectId } : query
  query = searchParams.userId ? { ...query, userId: searchParams.userId } : query
  query = searchParams.status ? { ...query, status: searchParams.status } : query

  return models.Task
    .findAll(
      {
        where: query,
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
