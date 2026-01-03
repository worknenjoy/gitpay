const Models = require('../../models')
const models = Models as any

export const findUser = async (id: number) => {

  return models.User.findByPk(id, {
    include: [
      {
        model: models.Type,
        as: 'Types'
      }
    ]
  })
}