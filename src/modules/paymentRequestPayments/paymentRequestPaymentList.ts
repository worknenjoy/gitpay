import models from '../../models'

const currentModels = models as any

type PaymentRequestPaymentListParams = {
  userId: number
}

export async function paymentRequestPaymentList({ userId }: PaymentRequestPaymentListParams) {
  return currentModels.PaymentRequestPayment.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: currentModels.PaymentRequest,
        attributes: ['title'],
      },
      {
        model: currentModels.PaymentRequestCustomer,
        attributes: ['email'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
}
