import Models from '../../../models'

const models = Models as any

export const findOrCreatePaymentRequestBalance = async (userId: number, options: any = {}) => {
  const currentBalance = await models.PaymentRequestBalance.findOrCreate({
    where: {
      userId: userId
    },
    defaults: {
      userId: userId,
      balance: 0
    },
    include: [
      {
        model: models.User
      }
    ],
    ...(options?.transaction ? { transaction: options.transaction } : {})
  })
  return currentBalance[0]
}
