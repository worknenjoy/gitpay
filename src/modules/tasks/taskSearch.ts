import models from '../../models'
import { Op, Sequelize } from 'sequelize'

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

  // hasBounty filter: 'true' → value > 0, 'false' → value <= 0
  if (searchParams.hasBounty === 'true' || searchParams.hasBounty === true) {
    whereBase.value = { [Op.gt]: 0 }
  } else if (searchParams.hasBounty === 'false' || searchParams.hasBounty === false) {
    whereBase.value = { [Op.lte]: 0 }
  }

  const labelIds = Array.isArray(searchParams.labelIds)
    ? searchParams.labelIds.map((n: any) => parseInt(n, 10)).filter(Number.isFinite)
    : []

  const languageIds = Array.isArray(searchParams.languageIds)
    ? searchParams.languageIds.map((n: any) => parseInt(n, 10)).filter(Number.isFinite)
    : searchParams.languageIds
      ? [searchParams.languageIds]
          .flat()
          .map((n: any) => parseInt(n, 10))
          .filter(Number.isFinite)
      : []

  // Pagination params
  const isPaginated = searchParams.limit != null
  const limit = isPaginated ? parseInt(searchParams.limit, 10) : undefined
  const computedOffset = isPaginated
    ? searchParams.offset != null
      ? parseInt(searchParams.offset, 10)
      : searchParams.page != null
        ? parseInt(searchParams.page, 10) * limit!
        : 0
    : undefined

  // Sort params — only direct Task columns are supported
  const SORTABLE_COLUMNS: Record<string, string> = {
    title: 'title',
    status: 'status',
    value: 'value',
    createdAt: 'createdAt'
  }
  const sortCol = searchParams.sortBy && SORTABLE_COLUMNS[searchParams.sortBy]
  const sortDir = searchParams.sortDirection === 'asc' ? 'ASC' : 'DESC'
  const orderClause: any[] = sortCol
    ? [[sortCol, sortDir]]
    : [['status', 'DESC'], ['id', 'DESC']]

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
                  through: { attributes: [] },
                  ...(languageIds.length > 0 && {
                    where: { id: { [Op.in]: languageIds } },
                    required: true
                  })
                }
              ],
              ...(languageIds.length > 0 && { required: true })
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

    if (isPaginated) {
      const count = tasks.length
      const rows = tasks.slice(computedOffset, computedOffset! + limit!)
      return { rows, count }
    }
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

  // Build the Project include, optionally requiring language match
  const projectInclude: any = {
    model: currentModels.Project,
    attributes: ['id', 'name', 'repo', 'OrganizationId'],
    include: [
      {
        model: currentModels.ProgrammingLanguage,
        as: 'ProgrammingLanguages',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        ...(languageIds.length > 0 && {
          where: { id: { [Op.in]: languageIds } },
          required: true
        })
      }
    ],
    ...(languageIds.length > 0 && { required: true })
  }

  const includeBase = [
    {
      model: currentModels.User,
      attributes: ['id', 'provider', 'name', 'username', 'picture_url', 'country', 'language']
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
    projectInclude,
    ordersInclude
  ]

  if (isPaginated) {
    const result = await currentModels.Task.findAndCountAll({
      where: whereTasks,
      attributes: taskAttrs,
      include: includeBase,
      distinct: true,
      limit,
      offset: computedOffset,
      order: orderClause
    })
    attachLabelsVirtual(result.rows)
    return { rows: result.rows, count: result.count }
  }

  const rows = await currentModels.Task.findAll({
    where: whereTasks,
    attributes: taskAttrs,
    include: includeBase,
    distinct: true,
    order: orderClause
  })

  attachLabelsVirtual(rows)

  // Legacy in-memory language filter for non-paginated path (kept for backward compat
  // when languageIds filter is not moved into the join for some reason)
  if (languageIds.length === 0) return rows

  return rows.filter((task: any) => {
    const project = task.Project
    return project?.ProgrammingLanguages?.some((pl: any) => languageIds.includes(pl.id))
  })
}
