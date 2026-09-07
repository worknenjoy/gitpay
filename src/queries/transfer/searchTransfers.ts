import Models from '../../models'

const models = Models as any

type TransferSearchParams = {
  userId?: number
  to?: number
}

export async function searchTransfers(params: TransferSearchParams = {}) {
  const userInclude = {
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
  }

  let transfers: any[] = []
  if (params.userId) {
    transfers = await models.Transfer.findAll({
      where: { userId: params.userId },
      order: [['createdAt', 'DESC']],
      include: [models.Task, userInclude]
    })
  }
  if (params.to) {
    transfers = await models.Transfer.findAll({
      where: { to: params.to },
      order: [['createdAt', 'DESC']],
      include: [models.Task, userInclude]
    })
  }
  return transfers
}
