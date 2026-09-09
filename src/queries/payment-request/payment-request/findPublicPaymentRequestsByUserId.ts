import Models from '../../../models'
import { Sequelize } from 'sequelize'

const models = Models as any

/**
 * Public-safe list of a user's active payment requests, with a computed
 * paid count. Attribute set is deliberately narrow for public consumption —
 * do not widen it without reconsidering what's safe to expose.
 */
export const findPublicPaymentRequestsByUserId = async (userId: number) => {
  return models.PaymentRequest.findAll({
    where: { userId, active: true },
    order: [['createdAt', 'DESC']],
    attributes: [
      'id',
      'title',
      'description',
      'payment_url',
      'amount',
      'currency',
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM "PaymentRequestPayments" prp WHERE prp."paymentRequestId" = "PaymentRequest"."id" AND prp."status" IN ('paid', 'succeeded'))`
        ),
        'paidCount'
      ]
    ]
  })
}
