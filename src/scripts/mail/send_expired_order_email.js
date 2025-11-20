const path = require('path')
const i18n = require('i18n')
const models = require('../../models')
const orderMail = require('../../modules/mail/order')

i18n.configure({
  directory:
    process.env.NODE_ENV !== 'production'
      ? path.join(__dirname, '../locales')
      : path.join(__dirname, '../locales', 'result'),
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false,
  logWarnFn: (msg) => console.warn('WARN:', msg),
  logErrorFn: (msg) => console.error('ERROR:', msg),
})

i18n.setLocale('en') // or 'br' depending on what you're testing

module.exports.sendExpiredOrderEmail = async (orderId) => {
  try {
    const order = await models.Order.findOne({
      where: { id: orderId },
      include: [models.User, models.Task],
    })
    if (!order) {
      console.log(`❌ [OrderCron][sendExpiredOrderEmail] Order ID: ${orderId} not found.`)
      return false
    }
    orderMail.expiredOrders(order.dataValues)
    console.log(
      `✅ [OrderCron][sendExpiredOrderEmail] Expired order email sent for order ID: ${orderId}.`,
    )
    return true
  } catch (error) {
    console.log(
      `❗ [OrderCron][sendExpiredOrderEmail] Error sending expired order email for order ID: ${orderId}:`,
      error,
    )
    return false
  }
}

module.exports.findExpiredOrders = async () => {
  try {
    const expiredOrders = await models.Order.findAll({
      where: {
        status: 'expired',
      },
      include: [models.User, models.Task],
    })
    console.log(`🔍 [OrderCron][findExpiredOrders] Found ${expiredOrders.length} expired orders.`)
    console.log(
      `🔍 [OrderCron][findExpiredOrders] Expired orders:`,
      expiredOrders.map((order) => order.id),
    )
    return expiredOrders
  } catch (error) {
    console.log(`❗ [OrderCron][findExpiredOrders] Error finding expired orders:`, error)
    return []
  }
}
