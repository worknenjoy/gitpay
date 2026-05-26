import Models from '../../models'
import { Op } from 'sequelize'

const models = Models as any

export const countUserCountries = async (): Promise<number> => {
  return models.User.count({
    distinct: true,
    col: 'country',
    where: { country: { [Op.ne]: null } }
  })
}
