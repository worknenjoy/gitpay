import { Op } from 'sequelize'
import Models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../user/userSensitiveAttributes'

const models = Models as any

export const findTransferByIdForFetch = async (id: number, userId: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: { id, [Op.or]: [{ userId }, { to: userId }] },
    include: [
      models.Task,
      {
        model: models.User,
        as: 'User',
        attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
      },
      {
        model: models.User,
        as: 'destination',
        attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
      }
    ],
    ...options
  })
}
