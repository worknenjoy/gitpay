import Models from '../../models'

const models = Models as any

export const findTransferByIdForUpdate = async (id: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: {
      id
    },
    include: [
      {
        model: models.User,
        as: 'User'
      },
      models.Task
    ],
    ...options
  })
}
