import models from '../../models'

const currentModels = models as any

type PaymentRequestBalanceListParams = {
  userId: number
}

export async function paymentRequestBalanceList({ userId }: PaymentRequestBalanceListParams) {
  return currentModels.PaymentRequestBalance.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: currentModels.PaymentRequestBalanceTransaction,
        attributes: [
          'id',
          'amount',
          'currency',
          'type',
          'reason',
          'status',
          'openedAt',
          'closedAt',
          'createdAt',
        ],
        separate: true,
        order: [['createdAt', 'DESC']],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
}
