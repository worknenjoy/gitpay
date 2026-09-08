import models from '../../models'
import { USER_SENSITIVE_ATTRIBUTES } from '../../queries/user/userSensitiveAttributes'

const currentModels = models as any

type OrderSearchParams = {
  id?: number
  userId?: number
}

export async function orderSearch(orderParams: OrderSearchParams) {
  try {
    let findOrderParams: any = {
      include: [
        { model: currentModels.User, attributes: { exclude: USER_SENSITIVE_ATTRIBUTES } },
        currentModels.Task
      ],
      order: [['id', 'DESC']]
    }
    if (orderParams && orderParams.id) {
      findOrderParams = {
        ...findOrderParams,
        where: {
          id: orderParams.id
        }
      }
    }
    if (orderParams && orderParams.userId) {
      findOrderParams = {
        ...findOrderParams,
        where: {
          userId: orderParams.userId
        }
      }
    }
    const data = await currentModels.Order.findAll(findOrderParams)
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error on order search', error)
    return false
  }
}
