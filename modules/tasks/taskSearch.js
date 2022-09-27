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

  if (searchParams.organizationId && !searchParams.projectId) {
    let tasks = []
    return models.Project
      .findAll(
        {
          where: { OrganizationId: parseInt(searchParams.organizationId) },
          include: [ {
            model: models.Task,
            include: [ models.User, models.Order, models.Assign, models.Label, models.Project ]
          }],
          order: [
            ['id', 'DESC']
          ]
        }
      )
      .then(projects => {
        projects.map(p => {
          p.Tasks.map(t => tasks.push(t))
        })
        return tasks
      })
  }
  else {
    return models.Task
      .findAll(
        {
          where: query,
          include: [ models.User, models.Order, { model: models.Assign, include: [models.User] }, models.Label, models.Project ],
          order: [
            ['status', 'DESC'],
            ['id', 'DESC']
          ]
        }
      )
      .then(data => {
        return data
      })
  }
})
