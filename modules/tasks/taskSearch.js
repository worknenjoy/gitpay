const Promise = require('bluebird')
const models = require('../../models')
const { Op, Sequelize } = require('sequelize')

module.exports = Promise.method(function taskSearch(searchParams) {
  let query = {
    [Op.or]: [
      { private: null },
      { private: false },
    ]
  }

  if (searchParams.projectId) query.ProjectId = { [Op.eq]: parseInt(searchParams.projectId) }
  if (searchParams.userId) query.userId = searchParams.userId
  if (searchParams.status) query.status = searchParams.status
  if (searchParams.url) query.url = searchParams.url

  const labelWhere = searchParams.labelIds ? {
    model: models.Label,
    where: { id: { [Op.in]: searchParams.labelIds } },
    attributes: ['name'],
    through: {
      attributes: []
    },
    group: ['tasks.id'], // Adjust according to your SQL dialect, e.g., "tasks.id" for Postgres
    having: Sequelize.literal(`COUNT(DISTINCT "Label"."id") = ${searchParams.labelIds.length}`)
  } : models.Label

  if (searchParams.organizationId && !searchParams.projectId) {
    let tasks = []
    return models.Project
      .findAll(
        {
          where: {
            OrganizationId: parseInt(searchParams.organizationId)
          },
          include: [{
            model: models.Task,
            include: [models.User, models.Order, models.Assign, models.Project, labelWhere]
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
              model: models.Project,
              include: [
                {
                  model: models.ProgrammingLanguage,
                  where: searchParams.languageIds ? { id: { [Op.in]: searchParams.languageIds } } : {},
                  attributes: ['name'],
                  through: {
                    attributes: [],
                  },
                  having: searchParams.languageIds ? Sequelize.literal(`COUNT(DISTINCT "ProgrammingLanguage"."id") = ${searchParams.languageIds.length}`) : undefined,
                },
              ],
            },
            {
              model: models.Assign, include: [models.User]
            },
            labelWhere
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
