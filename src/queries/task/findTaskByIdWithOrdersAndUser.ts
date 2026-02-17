import Models from '../../models'

const models = Models as any

export const findTaskByIdWithOrdersAndUser = async (taskId: number, options: any = {}) => {
  return models.Task.findOne({
    where: {
      id: taskId
    },
    include: [
      models.Order,
      {
        model: models.User,
        as: 'User'
      }
    ],
    ...options
  })
}
