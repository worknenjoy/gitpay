import Models from '../../../models'
import orderFetchPaypal from './orderFetchPaypal'
import orderFetchInvoice from './orderFetchInvoice'

const models = Models as any

export async function orderDetails(orderParams: any) {
  try {
    const order = await models.Order.findOne({
      where: { id: orderParams.id },
      include: models.User
    })
    let orderDetails = {}

    switch (order.provider) {
      case 'paypal': {
        const orderDetailsPaypal = await orderFetchPaypal(order.source_id)
        orderDetails = {
          ...order.dataValues,
          ...orderDetailsPaypal
        }
        break
      }
      case 'stripe': {
        switch (order.source_type) {
          case 'invoice-item': {
            const orderDetailsInvoice = await orderFetchInvoice(order.source_id)
            orderDetails = {
              ...order.dataValues,
              ...orderDetailsInvoice
            }
            break
          }
          default:
            orderDetails = order
            break
        }
        break
      }
      default:
        orderDetails = order
        break
    }
    return orderDetails
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
