import Models from '../../models'

const models = Models as any

export const findUserByIdSimple = async (id: number, options: any = {}) => {
  return models.User.findByPk(id, options)
}
