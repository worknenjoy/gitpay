const Promise = require('bluebird')
const models = require('../../models')
const { Op, Sequelize } = require('sequelize')

function makeLabelJsonAttr(tableAlias) {
  return [
    Sequelize.literal(`(
      SELECT COALESCE(
        json_agg(json_build_object('id', l.id, 'name', l.name) ORDER BY l.name)
        FILTER (WHERE l.id IS NOT NULL),
        '[]'::json
      )
      FROM "TaskLabels" tl
      JOIN "Labels" l ON l.id = tl."labelId"
      WHERE tl."taskId" = "${tableAlias}"."id"
    )`),
    'labels'
  ]
}

// Filtro “task contém TODAS as labels pedidas” usando COUNT DISTINCT com alias correto
function makeLabelFilterLiteral(tableAlias, ids) {
  if (!ids?.length) return null
  return Sequelize.literal(`(
    SELECT COUNT(DISTINCT tl."labelId")
    FROM "TaskLabels" tl
    WHERE tl."taskId" = "${tableAlias}"."id"
      AND tl."labelId" IN (${ids.join(',')})
  ) = ${ids.length}`)
}

// Mapeia o atributo agregado 'labels' (subquery JSON) para o shape esperado 'Labels'
function attachLabelsVirtual(instances) {
  const list = Array.isArray(instances) ? instances : [instances]
  for (const t of list) {
    const raw = t?.get ? t.get('labels') : t?.labels
    let arr = []

    if (Array.isArray(raw)) arr = raw
    else if (raw) { try { arr = JSON.parse(raw) } catch { arr = [] } }
    if (!Array.isArray(arr)) arr = []

    arr = arr.filter(Boolean).map(x => ({ id: x.id, name: x.name }))

    if (t?.setDataValue) t.setDataValue('Labels', arr)
    else t.Labels = arr

    if (t?.dataValues) delete t.dataValues.labels
  }
}

// Agrupa array por chave
function groupBy(arr, keyFn) {
  const map = new Map()
  for (const item of arr) {
    const k = keyFn(item)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(item)
  }
  return map
}

async function attachAssigns(tasks) {
  if (!tasks || tasks.length === 0) return
  const ids = tasks.map(t => t.id)
  const rows = await models.Assign.findAll({
    where: { TaskId: { [Op.in]: ids } },
    attributes: ['id', 'status', 'createdAt', 'TaskId', 'userId', 'message'],
    include: [
      { model: models.User, attributes: ['id', 'username', 'picture_url', 'name'] }
    ],
    order: [['createdAt', 'DESC']]
  })
  const byTask = groupBy(rows, r => r.TaskId)
  for (const t of tasks) {
    const list = byTask.get(t.id) || []
    if (t.setDataValue) t.setDataValue('Assigns', list)
    else t.Assigns = list
  }
}

/** ---- Main ---- **/

module.exports = Promise.method(function taskSearch(searchParams) {
  const whereBase = {
    [Op.or]: [{ private: null }, { private: false }]
  }

  if (searchParams.projectId) whereBase.ProjectId = { [Op.eq]: parseInt(searchParams.projectId) }
  if (searchParams.userId) whereBase.userId = searchParams.userId
  if (searchParams.status) whereBase.status = searchParams.status
  if (searchParams.url) whereBase.url = searchParams.url

  const labelIds = Array.isArray(searchParams.labelIds)
    ? searchParams.labelIds.map(n => parseInt(n, 10)).filter(Number.isFinite)
    : []

  const ordersInclude = {
    model: models.Order,
    separate: true,
    attributes: [
      'id', 'status', 'amount', 'currency', 'createdAt',
      'TaskId', 'userId', 'provider', 'source_id', 'transfer_id',
      'payment_url', 'destination', 'capture'
    ],
    order: [['createdAt', 'DESC']]
  }


  if (searchParams.organizationId && !searchParams.projectId) {
    
    const whereTasks = { ...whereBase }

    if (labelIds.length > 0) {
      const lblFilter = makeLabelFilterLiteral('Tasks', labelIds)
      whereTasks[Op.and] = whereTasks[Op.and] ? [...whereTasks[Op.and], lblFilter] : [lblFilter]
    }

    // atributos base de Tasks com subquery JSON usando alias "Tasks"
    const taskAttrsInProject = [
      'id', 'private', 'not_listed', 'title', 'url', 'status', 'level', 'deadline', 'value',
      'createdAt', 'updatedAt', 'ProjectId', 'userId',
      makeLabelJsonAttr('Tasks')
    ]

    let tasks = []
    return models.Project
      .findAll({
        where: { OrganizationId: parseInt(searchParams.organizationId) },
        include: [{
          model: models.Task,
          where: whereTasks,
          attributes: taskAttrsInProject,
          include: [
            { model: models.User, attributes: ['id', 'name', 'username', 'picture_url', 'country', 'language'] },
            {
              model: models.Project,
              attributes: ['id', 'name', 'repo'],
              include: [{
                model: models.ProgrammingLanguage,
                as: 'ProgrammingLanguages',
                attributes: ['id', 'name'],
                through: { attributes: [] }
              }]
            },
            ordersInclude // Orders sem limitar
          ],
          distinct: true,
          order: [['status', 'DESC'], ['id', 'DESC']]
        }],
        order: [['id', 'DESC']]
      })
      .then(async projects => {
        projects.forEach(p => p.Tasks.forEach(t => tasks.push(t)))
        attachLabelsVirtual(tasks)        // Labels via JSON
        await attachAssigns(tasks)        // TODOS os Assigns via batch
        return tasks
      })
  }

  const whereTasks = { ...whereBase }
  if (labelIds.length > 0) {
    const lblFilter = makeLabelFilterLiteral('Task', labelIds)
    whereTasks[Op.and] = whereTasks[Op.and] ? [...whereTasks[Op.and], lblFilter] : [lblFilter]
  }

  const taskAttrs = [
    'id', 'private', 'not_listed', 'title', 'url', 'status', 'level', 'deadline', 'value', 'assigned',
    'createdAt', 'updatedAt', 'ProjectId', 'userId',
    makeLabelJsonAttr('Task')
  ]

  return models.Task
    .findAll({
      where: whereTasks,
      attributes: taskAttrs,
      include: [
        { model: models.User, attributes: ['id', 'name', 'username', 'picture_url', 'country', 'language'] },
        {
          model: models.Project,
          attributes: ['id','name','repo'],
          include: [{
            model: models.ProgrammingLanguage,
            as: 'ProgrammingLanguages',
            attributes: ['id','name'],
            through: { attributes: [] }
          }]
        },
        ordersInclude // Orders sem limitar
      ],
      distinct: true,
      order: [['status', 'DESC'], ['id', 'DESC']]
    })
    .then(async rows => {
      attachLabelsVirtual(rows)
      await attachAssigns(rows)
      
      return rows.filter(task => {
        const project = task.Project
        if (searchParams.languageIds && searchParams.languageIds.length > 0) {
          return project?.ProgrammingLanguages?.some(pl => searchParams.languageIds.includes(`${pl.id}`))
        }
        return true
      })
    })
})