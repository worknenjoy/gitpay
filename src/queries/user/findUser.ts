import Models from '../../models'
const models = Models as any

export const findUser = async (params: any) => {
  return models.User.findOne({
    where: params,
    include: [
      {
        model: models.Type,
        as: 'Types'
      }
    ]
  })
}
