const Promise = require('bluebird')
const models = require('../../models')
const { Op , Sequelize} = require('sequelize')

module.exports = Promise.method(function taskSearch (searchParams) {
  let query = { [Op.or]: [
    { private: null },
    { private: false }
  ] }

  query = searchParams.projectId ? { ...query, ProjectId: searchParams.projectId } : query
  query = searchParams.userId ? { ...query, userId: searchParams.userId } : query
  query = searchParams.status ? { ...query, status: searchParams.status } : query
  query = searchParams.organizationId ? { ...query, OrganizationId: searchParams.organizationId } : query
  //query = searchParams.labelIds ? { ...query, LabelId: searchParams.labelIds } : query
  const labelWhere = searchParams.labelIds ? { 
    model: models.Label,
    where: { id: { [Op.in]: searchParams.labelIds } },
    attributes: [],
    through: {
      attributes: [], // Isso irá evitar que os campos da tabela de relação sejam retornados
    },
    group: ['tasks.id'],  // Adjust according to your SQL dialect, e.g., "tasks.id" for Postgres
    having: Sequelize.literal(`COUNT(DISTINCT "Label"."id") = ${searchParams.labelIds.length}`)
  } : models.Label

  if (searchParams.organizationId && !searchParams.projectId) {
    let tasks = []
    return models.Project
      .findAll(
        {
          where: { OrganizationId: parseInt(searchParams.organizationId), ...query },
          include: [ {
            model: models.Task,
            include: [ models.User, models.Order, models.Assign, models.Project, labelWhere ]
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
          include: [ 
            models.User,
            models.Order,
            { 
              model: models.Assign, include: [models.User] 
            },
            labelWhere, 
            models.Project 
          ],
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
