import models from '../../models'

const currentModels = models as any

type OrderFetchParams = {
  id: number
}

export async function orderFetch(orderParams: OrderFetchParams) {
  try {
    const data = await currentModels.Order.findOne({
      where: { id: orderParams.id },
      include: currentModels.User
    })
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
