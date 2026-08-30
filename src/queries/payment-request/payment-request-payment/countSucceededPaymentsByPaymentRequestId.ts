import Models from '../../../models'
import { fn, col } from 'sequelize'

const models = Models as any

/**
 * Count of succeeded/paid payments per payment request, batched for a list of ids
 * (avoids an N+1 query per payment link when rendering a "N paid" count).
 */
export const countSucceededPaymentsByPaymentRequestId = async (
  paymentRequestIds: Array<number | string>
): Promise<Record<number, number>> => {
  if (!paymentRequestIds.length) return {}

  const rows = await models.PaymentRequestPayment.findAll({
    where: { paymentRequestId: paymentRequestIds, status: ['paid', 'succeeded'] },
    attributes: ['paymentRequestId', [fn('COUNT', col('id')), 'count']],
    group: ['paymentRequestId'],
    raw: true
  })

  return rows.reduce((acc: Record<number, number>, row: any) => {
    acc[row.paymentRequestId] = parseInt(row.count, 10) || 0
    return acc
  }, {})
}
