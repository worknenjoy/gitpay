import Models from '../../models'
import { Op } from 'sequelize'

const models = Models as any

export const findUsersWithAccountId = async () => {
  return models.User.findAll({
    where: { account_id: { [Op.ne]: null } }
  })
}
