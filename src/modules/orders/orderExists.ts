import models from '../../models'

const currentModels = models as any

type OrderExistsParams = {
  id: number
}

export async function orderExists(orderAttributes: OrderExistsParams) {
  try {
    const order = await currentModels.Order.findOne({
      where: {
        id: orderAttributes.id
      }
    })
    if (!order) return false
    return order
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}
