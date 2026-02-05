import request from './request'
import i18n from 'i18n'
import emailTemplate from './templates/base-content'

const OrderMail = {
  expiredOrders: async (order: any) => {
    const { User: user } = order
    const to = user.email
    const language = user.language || 'en'
    const task = order.Task
    const receiveNotifications = user?.receiveNotifications

    if (!receiveNotifications) {
      return
    }

    i18n.setLocale(language)
    const mailData = {
      title: task.title,
      url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`,
      value: order.amount
    }

    try {
      return await request(to, i18n.__('mail.order.expiredOrders.subject'), [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(`
          <p>${i18n.__('mail.order.expiredOrders.content.main', mailData)}</p>`)
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default OrderMail

module.exports = OrderMail
