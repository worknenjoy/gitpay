import Models from '../../models'
const models = Models as any

export const findUserById = async (id: number) => {

  return models.User.findByPk(id, {
    include: [
      {
        model: models.Type,
        as: 'Types'
      }
    ]
  })
}