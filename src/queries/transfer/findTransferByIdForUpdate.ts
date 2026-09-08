import { Op } from 'sequelize'
import Models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../user/userSensitiveAttributes'

const models = Models as any

export const findTransferByIdForUpdate = async (id: number, userId: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: {
      id,
      [Op.or]: [{ userId }, { to: userId }]
    },
    include: [
      {
        model: models.User,
        as: 'User',
        attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
      },
      models.Task
    ],
    ...options
  })
}
