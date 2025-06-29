const i18n = require('i18n');
const models = require('../models');
const orderMail = require('../modules/mail/order');

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

module.exports.sendExpiredOrderEmail = async (orderId) => {
  try {
    const order = await models.Order.findOne({
      where: { id: orderId },
      include: [models.User, models.Task]
    });
    if (!order) {
      console.log(`❌ [OrderCron][sendExpiredOrderEmail] Order ID: ${orderId} not found.`);
      return false;
    }
    await orderMail.expiredOrders(order.dataValues);
    console.log(`✅ [OrderCron][sendExpiredOrderEmail] Expired order email sent for order ID: ${orderId}.`);
    return true;
  } catch (error) {
    console.log(`❗ [OrderCron][sendExpiredOrderEmail] Error sending expired order email for order ID: ${orderId}:`, error);
    return false;
  }
}