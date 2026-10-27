import models from '../../models'

const currentModels = models as any

type OrderFetchParams = {
  id: number
  userId: number
}

export async function orderFetch(orderParams: OrderFetchParams) {
  try {
    const data = await currentModels.Order.findOne({
      where: { id: orderParams.id, userId: orderParams.userId },
      include: currentModels.User
    })
    if (!data) {
      return false
    }

    return {
      source_id: data.source_id,
      currency: data.currency,
      amount: data.amount
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
