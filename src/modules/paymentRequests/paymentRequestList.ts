import Models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'
const models = Models as any

export interface PaymentRequestParams {
  userId: number
}

export async function paymentRequestList(paymentRequestParams: PaymentRequestParams) {
  const paymentRequestList = await models.PaymentRequest.findAll({
    where: { userId: paymentRequestParams.userId },
    order: [['createdAt', 'DESC']],
    include: [{ model: models.User, attributes: { exclude: USER_SENSITIVE_ATTRIBUTES } }]
  })
  return paymentRequestList
}
