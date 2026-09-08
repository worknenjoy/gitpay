import models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../user/userSensitiveAttributes'

const currentModels = models as any

export async function findPayoutsByUserId(userId: number) {
  return currentModels.Payout.findAll({
    where: { userId },
    include: [{ model: currentModels.User, attributes: { exclude: USER_SENSITIVE_ATTRIBUTES } }],
    order: [['createdAt', 'DESC']]
  })
}
