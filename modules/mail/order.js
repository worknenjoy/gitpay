const request = require('./request')
const Signatures = require('./content')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

const OrderMail = {
  expiredOrders: (order) => {}
}

if(constants.canSendEmail) {
  OrderMail.expiredOrders = (order) => {
    const { User: user } = order
    const to = user.email
    const language = user.language || 'en'
    const task = order.Task
    i18n.setLocale(language)
    const mailData = { 
      title: task.title,
      url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`,
      value: order.amount
    }
    user?.receiveNotifications && request(
      to,
      i18n.__('mail.order.expiredOrders.subject'),
      [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.order.expiredOrders.content.main', mailData)}</p>`, 
            `The pre authorized payment of $ ${mailData.value} for the issue <a href=\"${mailData.url}\">${mailData.title}</a> made using Paypal expired, and you need to make a new payment to keep the bounty available. Please visit https://gitpay.me/#/profile/payments to update your payment.`)
        }
      ]
    )
  }
}

module.exports = OrderMail
