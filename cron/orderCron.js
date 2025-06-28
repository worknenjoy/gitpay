const models = require('../models')
const { Op } = require('sequelize')
const OrderDetails = require('../modules/orders/orderDetails')
const OrderCancel = require('../modules/orders/orderCancel')
const requestPromise = require('request-promise')
const orderMail = require('../modules/mail/order')

const OrderCron = {
  verify: async () => {
    const orders = await models.Order.findAll({ where: {
      amount: {
        [Op.gt]: 0
      },
      status: {
        [Op.eq]: 'succeeded'
      },
      provider: {
        [Op.eq]: 'paypal'
      }
    },
    include: [ models.User, models.Task ]
    })
    if (orders.length) {
      let invalids = []
      orders.forEach(async order => {
        const orderValues = order.dataValues
        if (orderValues.source_id) {
          const orderWithDetails = await OrderDetails({ id: orderValues.id })
          if (!orderWithDetails) {
            const orderCanceled = await OrderCancel({ id: orderValues.id })
            if (orderCanceled) {
              invalids.push(order)
            }
          }
        }
      })
      return invalids
    }
    return []
  },
  checkExpiredPaypalOrders: async () => {
    const orders = await models.Order.findAll({ where: {
        status: {
          [Op.eq]: 'succeeded'
        },
        provider: {
          [Op.eq]: 'paypal'
        },
        paid: {
          [Op.eq]: true
        }
      },
      include: [ models.User, models.Task ]
    })
    if (orders[0]) {
      try {
        const authorize = await requestPromise({
          method: 'POST',
          uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString('base64'),
            'Content-Type': 'application/json',
            'grant_type': 'client_credentials'
          },
          form: {
            'grant_type': 'client_credentials'
          }
        })
        orders.map(async o => {
          const { dataValues: order } = o
          if (order) {
            if (order.status === 'succeeded' && order.paid && order.source_id) {
              const orderDetails = () => requestPromise({
                method: 'GET',
                uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${o.source_id}`,
                headers: {
                  'Authorization': 'Bearer ' + JSON.parse(authorize)['access_token']
                }
              }).then(result => {
                return JSON.parse(result)
              }).catch(e => {
                console.log('error on order details', e.error)
                return JSON.parse(e.error)
              })
              const orderDetailsResult =  await orderDetails()
              if(orderDetailsResult["name"] === 'RESOURCE_NOT_FOUND') {
                return models.Order.update({ status: 'expired', paid: false }, { where: { id: o.dataValues.id } }).then(orderUpdated => {
                  if(orderUpdated[0] === 1) {
                    orderMail.expiredOrders(order)
                    return;
                  }
                })
              }
            }
          }
        })
      } catch (e) {
        console.log('error', e)
      }
    }
    return orders
  }
}

module.exports = OrderCron