import models from '../../models'
const { Op, Sequelize } = require('sequelize')

const currentModels = models as any

function makeLabelJsonAttr(tableAlias: string) {
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

function makeLabelFilterLiteral(tableAlias: string, ids: number[]) {
  if (!ids?.length) return null
  return Sequelize.literal(`(
    SELECT COUNT(DISTINCT tl."labelId")
    FROM "TaskLabels" tl
    WHERE tl."taskId" = "${tableAlias}"."id"
      AND tl."labelId" IN (${ids.join(',')})
  ) = ${ids.length}`)
}

function attachLabelsVirtual(instances: any) {
  const list = Array.isArray(instances) ? instances : [instances]
  for (const t of list) {
    const raw = t?.get ? t.get('labels') : t?.labels
    let arr = []

    if (Array.isArray(raw)) arr = raw
    else if (raw) {
      try {
        arr = JSON.parse(raw)
      } catch {
        arr = []
      }
    }
    if (!Array.isArray(arr)) arr = []
    const seen = new Set()
    const deduped = []
    for (const x of arr) {
      if (!x || x.id == null) continue
      if (seen.has(x.id)) continue
      seen.add(x.id)
      deduped.push({ id: x.id, name: x.name })
    }

    if (t?.setDataValue) t.setDataValue('Labels', deduped)
    else t.Labels = deduped

    if (t?.dataValues) delete t.dataValues.labels
  }
}

function groupBy(arr: any[], keyFn: (item: any) => any) {
  const map = new Map()
  for (const item of arr) {
    const k = keyFn(item)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(item)
  }
  return map
}

export async function taskSearch(searchParams: any) {
  const whereBase: any = {
    [Op.or]: [{ private: null }, { private: false }]
  }

  if (searchParams.projectId) whereBase.ProjectId = { [Op.eq]: parseInt(searchParams.projectId) }
  if (searchParams.userId) whereBase.userId = searchParams.userId
  if (searchParams.status) whereBase.status = searchParams.status
  if (searchParams.url) whereBase.url = searchParams.url

  const labelIds = Array.isArray(searchParams.labelIds)
    ? searchParams.labelIds.map((n: any) => parseInt(n, 10)).filter(Number.isFinite)
    : []

  const ordersInclude = {
    model: currentModels.Order,
    separate: true,
    attributes: [
      'id',
      'status',
      'amount',
      'currency',
      'createdAt',
      'TaskId',
      'userId',
      'provider',
      'source_id',
      'transfer_id',
      'payment_url',
      'destination',
      'capture'
    ],
    order: [['createdAt', 'DESC']]
  }

  if (searchParams.organizationId && !searchParams.projectId) {
    const whereTasks: any = { ...whereBase }

    if (labelIds.length > 0) {
      const lblFilter = makeLabelFilterLiteral('Tasks', labelIds)
      whereTasks[Op.and] = whereTasks[Op.and] ? [...whereTasks[Op.and], lblFilter] : [lblFilter]
    }

    const taskAttrsInProject = [
      'id',
      'provider',
      'private',
      'not_listed',
      'title',
      'url',
      'status',
      'level',
      'deadline',
      'value',
      'createdAt',
      'updatedAt',
      'ProjectId',
      'userId',
      makeLabelJsonAttr('Tasks')
    ]

    let tasks: any[] = []
    const projects = await currentModels.Project.findAll({
      where: { OrganizationId: parseInt(searchParams.organizationId) },
      include: [
        {
          model: currentModels.Task,
          where: whereTasks,
          attributes: taskAttrsInProject,
          include: [
            {
              model: currentModels.User,
              attributes: ['id', 'name', 'username', 'picture_url', 'country', 'language']
            },
            {
              model: currentModels.Assign,
              separate: true,
              attributes: ['id', 'status', 'message', 'createdAt', 'TaskId', 'userId'],
              include: [
                { model: currentModels.User, attributes: ['id', 'username', 'picture_url', 'name'] }
              ],
              order: [['createdAt', 'DESC']]
            },
            {
              model: currentModels.Project,
              attributes: ['id', 'name', 'repo', 'OrganizationId'],
              include: [
                {
                  model: currentModels.ProgrammingLanguage,
                  as: 'ProgrammingLanguages',
                  attributes: ['id', 'name'],
                  through: { attributes: [] }
                }
              ]
            },
            ordersInclude
          ],
          distinct: true,
          order: [
            ['status', 'DESC'],
            ['id', 'DESC']
          ]
        }
      ],
      order: [['id', 'DESC']]
    })
    
    projects.forEach((p: any) => p.Tasks.forEach((t: any) => tasks.push(t)))
    attachLabelsVirtual(tasks)
    return tasks
  }

  const whereTasks: any = { ...whereBase }
  if (labelIds.length > 0) {
    const lblFilter = makeLabelFilterLiteral('Task', labelIds)
    whereTasks[Op.and] = whereTasks[Op.and] ? [...whereTasks[Op.and], lblFilter] : [lblFilter]
  }

  const taskAttrs = [
    'id',
    'provider',
    'private',
    'not_listed',
    'title',
    'url',
    'status',
    'level',
    'deadline',
    'value',
    'assigned',
    'createdAt',
    'updatedAt',
    'ProjectId',
    'userId',
    makeLabelJsonAttr('Task')
  ]

  const rows = await currentModels.Task.findAll({
    where: whereTasks,
    attributes: taskAttrs,
    include: [
      {
        model: currentModels.User,
        attributes: ['id', 'provider', 'name', 'username', 'picture_url', 'country', 'language']
      },
      {
        model: currentModels.Assign,
        separate: true,
        attributes: ['id', 'status', 'message', 'createdAt', 'TaskId', 'userId'],
        include: [{ model: currentModels.User, attributes: ['id', 'username', 'picture_url', 'name'] }],
        order: [['createdAt', 'DESC']]
      },
      {
        model: currentModels.Project,
        attributes: ['id', 'name', 'repo', 'OrganizationId'],
        include: [
          {
            model: currentModels.ProgrammingLanguage,
            as: 'ProgrammingLanguages',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ]
      },
      ordersInclude
    ],
    distinct: true,
    order: [
      ['status', 'DESC'],
      ['id', 'DESC']
    ]
  })
  
  attachLabelsVirtual(rows)

  return rows.filter((task: any) => {
    const project = task.Project
    if (searchParams.languageIds && searchParams.languageIds.length > 0) {
      return project?.ProgrammingLanguages?.some((pl: any) =>
        searchParams.languageIds.includes(`${pl.id}`)
      )
    }
    return true
  })
}
