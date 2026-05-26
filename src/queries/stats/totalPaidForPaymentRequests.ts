import Models from '../../models'
import { fn, col } from 'sequelize'

const models = Models as any

export const totalPaidForPaymentRequests = async (): Promise<number> => {
  const result = await models.PaymentRequestPayment.findOne({
    where: { status: ['paid', 'succeeded'] },
    attributes: [[fn('SUM', col('amount')), 'total']]
  })
  return parseInt(result?.getDataValue('total') ?? '0', 10) || 0
}
