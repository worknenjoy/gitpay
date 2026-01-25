import Models from '../../models'
const models = Models as any

export const findUsers = async (params: any) => {
  return models.User.findAll({
    where: params
  })
}
