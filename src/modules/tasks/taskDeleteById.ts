import Models from '../../models'

const models = Models as any

interface TaskParameters {
  id: number
  userId?: number
}

export async function taskDeleteById(taskParameters: TaskParameters, transaction?: any) {
  const hasOrdersAssociated = await models.Order.findOne({
    where: {
      TaskId: taskParameters.id
    },
    transaction
  })

  if (hasOrdersAssociated) {
    throw new Error('CANNOT_DELETE_ISSUE_WITH_ORDERS_ASSOCIATED')
  }

  await Promise.all([
    models.History.destroy({ where: { TaskId: taskParameters.id }, transaction }),
    models.Offer.destroy({ where: { taskId: taskParameters.id }, transaction }),
    models.Member.destroy({ where: { taskId: taskParameters.id }, transaction }),
    models.sequelize.query(`DELETE FROM "TaskLabels" WHERE "taskId" = ?`, {
      replacements: [taskParameters.id],
      transaction
    })
  ])

  const tasks: Array<{ dataValues?: { Labels?: Array<{ id: number }> } }> =
    await models.Task.findAll({
      where: {
        id: taskParameters.id
      },
      include: [models.Label],
      transaction
    })

  const labels = tasks[0]?.dataValues?.Labels ?? []
  if (labels.length > 0) {
    await Promise.all(
      labels.map((label) => models.Label.destroy({ where: { id: label.id }, transaction }))
    )
  }

  const conditions: { id: number; userId?: number } = { id: taskParameters.id }
  if (taskParameters.userId) {
    conditions.userId = taskParameters.userId
  }

  return models.Task.destroy({ where: conditions, transaction })
}

export default taskDeleteById
