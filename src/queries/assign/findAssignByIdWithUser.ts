import Models from '../../models'

const models = Models as any

export const findAssignByIdWithUser = async (assignId: number, options: any = {}) => {
  return models.Assign.findOne({
    where: {
      id: assignId
    },
    include: [
      {
        model: models.User,
        as: 'User'
      }
    ],
    ...options
  })
}
