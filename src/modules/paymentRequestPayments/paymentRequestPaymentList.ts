import models from '../../models'
import { computePaymentFeeBreakdown } from '../../services/paymentRequest/feeBreakdown'

const currentModels = models as any

type PaymentRequestPaymentListParams = {
  userId: number
}

export async function paymentRequestPaymentList({ userId }: PaymentRequestPaymentListParams) {
  const payments = await currentModels.PaymentRequestPayment.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: currentModels.PaymentRequest,
        attributes: [
          'title',
          'provider',
          'transfer_status',
          'transfer_id',
          'amount',
          'custom_amount',
          'currency',
          'platform_fee_percent'
        ]
      },
      {
        model: currentModels.PaymentRequestCustomer,
        attributes: ['email']
      }
    ],
    order: [['createdAt', 'DESC']]
  })

  // Same breakdown the payout emails use, so the details drawer shows identical rows.
  return payments.map((payment: any) => {
    const json = payment.toJSON()
    const fee_breakdown = json.PaymentRequest
      ? computePaymentFeeBreakdown({
          paymentRequestPayment: json,
          paymentRequest: json.PaymentRequest,
          currency: json.currency || json.PaymentRequest.currency || 'usd'
        })
      : null
    return { ...json, fee_breakdown }
  })
}
