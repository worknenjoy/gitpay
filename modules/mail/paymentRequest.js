const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

const PaymentRequestMail = {
  paymentRequestInitiated: async (user, paymentRequest) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)
    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.created.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(`
      <p>${i18n.__('mail.paymentRequest.created.message', {
              title: paymentRequest.title,
              description: paymentRequest.description,
              amount: paymentRequest.amount,
              currency: paymentRequest.currency,
              paymentUrl: paymentRequest.payment_url,
            })}</p>`)
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  transferInitiatedForPaymentRequest: async (user, paymentRequest, transfer_amount) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)
    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.transferInitiated.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(`
        <p>${i18n.__('mail.paymentRequest.transferInitiated.message', {
              title: paymentRequest.title,
              description: paymentRequest.description,
              amount: paymentRequest.amount,
              currency: paymentRequest.currency,
              transfer_amount: transfer_amount
            })}</p>`)
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}


module.exports = PaymentRequestMail
