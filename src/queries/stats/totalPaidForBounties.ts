import Models from '../../models'
import { fn, col } from 'sequelize'

const models = Models as any

export const totalPaidForBounties = async (): Promise<number> => {
  const result = await models.Order.findOne({
    where: { status: 'succeeded', paid: true },
    attributes: [[fn('SUM', col('amount')), 'total']]
  })
  return parseInt(result?.getDataValue('total') ?? '0', 10) || 0
}
