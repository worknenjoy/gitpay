import Models from '../../models'

const models = Models as any

export const findTasksWithOrders = async (options: any = {}) => {
  return models.Task.findAll({
    include: [
      {
        model: models.Order,
        where: {
          status: 'succeeded',
          paid: true
        },
        required: true
      }
    ],
    ...options
  })
}
