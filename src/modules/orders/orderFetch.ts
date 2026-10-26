import models from '../../models'

const currentModels = models as any

type OrderFetchParams = {
  id: number
  userId?: number
}

export async function orderFetch(orderParams: OrderFetchParams) {
  const data = await currentModels.Order.findOne({
    where: { id: orderParams.id },
    include: currentModels.User
  })

  if (!data) {
    const err: any = new Error('Order not found')
    err.status = 404
    throw err
  }

  if (orderParams.userId && Number(data.userId) !== Number(orderParams.userId)) {
    const err: any = new Error('Unauthorized')
    err.status = 403
    throw err
  }

  return {
    source_id: data.source_id,
    currency: data.currency,
    amount: data.amount
  }
}
