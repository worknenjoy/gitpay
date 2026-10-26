import models from '../../models'

const currentModels = models as any

type OrderSearchParams = {
  id?: number
  userId?: number
}

export async function orderSearch(orderParams: OrderSearchParams) {
  try {
    const where: any = {}
    if (orderParams && orderParams.id) {
      where.id = orderParams.id
    }
    if (orderParams && orderParams.userId) {
      where.userId = orderParams.userId
    }

    const findOrderParams: any = {
      include: [currentModels.User, currentModels.Task],
      order: [['id', 'DESC']]
    }
    if (Object.keys(where).length > 0) {
      findOrderParams.where = where
    }
    const data = await currentModels.Order.findAll(findOrderParams)
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error on order search', error)
    return false
  }
}
