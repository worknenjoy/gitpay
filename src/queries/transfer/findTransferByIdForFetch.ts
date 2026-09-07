import { Op } from 'sequelize'
import Models from '../../models'

const models = Models as any

export const findTransferByIdForFetch = async (id: number, userId: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: { id, [Op.or]: [{ userId }, { to: userId }] },
    include: [
      models.Task,
      {
        model: models.User,
        as: 'User',
        attributes: {
          exclude: [
            'password',
            'recover_password_token',
            'activation_token',
            'email_change_token',
            'pending_email_change',
            'paypal_id',
            'customer_id',
            'account_id',
            'whop_account_id'
          ]
        }
      },
      {
        model: models.User,
        as: 'destination',
        attributes: {
          exclude: [
            'password',
            'recover_password_token',
            'activation_token',
            'email_change_token',
            'pending_email_change',
            'paypal_id',
            'customer_id',
            'account_id',
            'whop_account_id'
          ]
        }
      }
    ],
    ...options
  })
}
