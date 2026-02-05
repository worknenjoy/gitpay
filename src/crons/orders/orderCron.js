const models = require('../../models')
const { Op } = require('sequelize')
const OrderDetails = require('../../modules/orders/orderDetails/orderDetails')
const OrderCancel = require('../../modules/orders/orderCancel')
const requestPromise = require('request-promise')
const orderMail = require('../../mail/order')

const OrderCron = {
  verify: async () => {
    console.log('🔎 [OrderCron][verify] Starting verification of PayPal succeeded orders...')
    const orders = await models.Order.findAll({
      where: {
        amount: { [Op.gt]: 0 },
        status: { [Op.eq]: 'succeeded' },
        provider: { [Op.eq]: 'paypal' }
      },
      include: [models.User, models.Task]
    })
    console.log(`📦 [OrderCron][verify] Found ${orders.length} orders to verify.`)
    if (orders.length) {
      let invalids = []
      await Promise.all(
        orders.map(async (order) => {
          const orderValues = order.dataValues
          if (orderValues.source_id) {
            console.log(
              `📝 [OrderCron][verify] Checking order ID: ${orderValues.id} (source_id: ${orderValues.source_id})`
            )
            const orderWithDetails = await OrderDetails({ id: orderValues.id })
            if (!orderWithDetails) {
              console.log(
                `⚠️ [OrderCron][verify] No details found for order ID: ${orderValues.id}. Attempting to cancel...`
              )
              const orderCanceled = await OrderCancel({ id: orderValues.id })
              if (orderCanceled) {
                console.log(
                  `✅ [OrderCron][verify] Order ID: ${orderValues.id} canceled successfully.`
                )
                invalids.push(order)
              } else {
                console.log(`❌ [OrderCron][verify] Failed to cancel order ID: ${orderValues.id}.`)
              }
            } else {
              console.log(`👍 [OrderCron][verify] Order ID: ${orderValues.id} has valid details.`)
            }
          }
        })
      )
      console.log(
        `🎯 [OrderCron][verify] Verification complete. Invalid orders found: ${invalids.length}`
      )
      return invalids
    }
    console.log('ℹ️ [OrderCron][verify] No orders to verify.')
    return []
  },
  checkExpiredPaypalOrders: async () => {
    console.log('⏰ [OrderCron][checkExpiredPaypalOrders] Checking for expired PayPal orders...')
    const orders = await models.Order.findAll({
      where: {
        status: { [Op.eq]: 'succeeded' },
        provider: { [Op.eq]: 'paypal' },
        paid: { [Op.eq]: true }
      },
      include: [models.User, models.Task]
    })
    console.log(
      `📦 [OrderCron][checkExpiredPaypalOrders] Found ${orders.length} PayPal orders to check.`
    )
    if (orders[0]) {
      try {
        console.log('🔑 [OrderCron][checkExpiredPaypalOrders] Requesting PayPal OAuth token...')
        const authorize = await requestPromise({
          method: 'POST',
          uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en_US',
            Authorization:
              'Basic ' +
              Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
                'base64'
              ),
            'Content-Type': 'application/json',
            grant_type: 'client_credentials'
          },
          form: {
            grant_type: 'client_credentials'
          }
        })
        await Promise.all(
          orders.map(async (o) => {
            const { dataValues: order } = o
            if (order && order.status === 'succeeded' && order.paid && order.source_id) {
              console.log(
                `🔍 [OrderCron][checkExpiredPaypalOrders] Checking PayPal order status for order ID: ${order.id}, source_id: ${order.source_id}`
              )
              const orderDetails = () =>
                requestPromise({
                  method: 'GET',
                  uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${o.source_id}`,
                  headers: {
                    Authorization: 'Bearer ' + JSON.parse(authorize)['access_token']
                  }
                })
                  .then((result) => {
                    return JSON.parse(result)
                  })
                  .catch((e) => {
                    console.log(
                      `⚠️ [OrderCron][checkExpiredPaypalOrders] Error fetching order details for order ID: ${order.id}:`,
                      e.error
                    )
                    return JSON.parse(e.error)
                  })
              const orderDetailsResult = await orderDetails()
              const purchaseUnits = orderDetailsResult['purchase_units'] || []
              const authorizationDetails = purchaseUnits.length > 0 ? purchaseUnits[0] : null
              const paymentAuthorization =
                authorizationDetails?.['payments']?.['authorizations'] || []
              const authorizationStatus =
                paymentAuthorization.length > 0 ? paymentAuthorization[0]['status'] : null

              if (
                orderDetailsResult['name'] === 'RESOURCE_NOT_FOUND' ||
                authorizationStatus === 'VOIDED' ||
                authorizationStatus === 'EXPIRED' ||
                authorizationStatus === 'CANCELED'
              ) {
                console.log(
                  `📜 [OrderCron][checkExpiredPaypalOrders] PayPal order details for order ID: ${order.id}:`,
                  orderDetailsResult
                )
                console.log(
                  `📦 [OrderCron][checkExpiredPaypalOrders] Purchase units for order ID: ${order.id}:`,
                  purchaseUnits
                )
                console.log(
                  `💳 [OrderCron][checkExpiredPaypalOrders] Payment authorizations for order ID: ${order.id}:`,
                  paymentAuthorization
                )
                console.log(
                  `🔍 [OrderCron][checkExpiredPaypalOrders] PayPal authorization details for ID: ${order.id}`,
                  authorizationDetails
                )
                console.log(
                  `⏳ [OrderCron][checkExpiredPaypalOrders] Checking if authorization for order ID: ${order.id} with STATUS ${authorizationStatus} has expired...`
                )
                console.log(
                  `🕑 [OrderCron][checkExpiredPaypalOrders] PayPal resource not found for order ID: ${order.id}. Marking as expired...`
                )
                await models.Order.update(
                  { status: 'expired', paid: false },
                  { where: { id: o.dataValues.id } }
                ).then((orderUpdated) => {
                  if (orderUpdated[0] === 1) {
                    console.log(
                      `✅ [OrderCron][checkExpiredPaypalOrders] Order ID: ${order.id} marked as expired. Sending notification email...`
                    )
                    orderMail.expiredOrders(order)
                  } else {
                    console.log(
                      `❌ [OrderCron][checkExpiredPaypalOrders] Failed to update order ID: ${order.id} as expired.`
                    )
                  }
                })
              } else {
                console.log(
                  `👍 [OrderCron][checkExpiredPaypalOrders] Order ID: ${order.id} is still valid on PayPal.`
                )
              }
            }
          })
        )
      } catch (e) {
        console.log(
          '❗ [OrderCron][checkExpiredPaypalOrders] Error during PayPal expired order check:',
          e
        )
      }
    } else {
      console.log('ℹ️ [OrderCron][checkExpiredPaypalOrders] No PayPal orders to check.')
    }
    return orders
  }
}

module.exports = OrderCron
