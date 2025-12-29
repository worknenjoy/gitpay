import Models from '../../../models'

const models = Models as any

export const findOrCreatePaymentRequestBalance = async (userId: number) => {
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
    ]
  })
  return currentBalance[0]
}
