import Models from '../../models'

const models = Models as any

export const findTransferByIdForFetch = async (id: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: { id },
    include: [
      models.Task,
      {
        model: models.User,
        as: 'User'
      },
      {
        model: models.User,
        as: 'destination'
      }
    ],
    ...options
  })
}
