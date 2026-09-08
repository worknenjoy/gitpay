import models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

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
        model: currentModels.User,
        attributes: { exclude: USER_SENSITIVE_ATTRIBUTES }
      },
      {
        model: currentModels.PaymentRequest
      }
    ]
  })
  return paymentRequestTransferList
}
