import models from '../../models'

const currentModels = models as any

type PaymentRequestTransferListParams = {
  userId: number
}

export async function paymentRequestTransferList({ userId }: PaymentRequestTransferListParams) {
  const paymentRequestTransferList = await currentModels.PaymentRequestTransfer.findAll({
    where: {
      userId: userId
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: currentModels.User
      },
      {
        model: currentModels.PaymentRequest
      }
    ]
  })
  return paymentRequestTransferList
}
