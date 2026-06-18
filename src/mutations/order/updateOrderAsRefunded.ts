import Models from '../../models'

const models = Models as any

type UpdateOrderAsRefundedExtra = {
  refund_id?: string
}

export async function updateOrderAsRefunded(
  where: Record<string, any>,
  extra?: UpdateOrderAsRefundedExtra
) {
  return models.Order.update(
    { paid: false, status: 'refunded', ...extra },
    { where, returning: true }
  )
}
