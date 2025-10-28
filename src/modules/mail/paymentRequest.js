const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')
const TableTemplate = require('./templates/table-content')
const currencyInfo = require('../util/currency-info')
const { handleAmount } = require('../util/handle-amount/handle-amount')
const paymentRequest = require('../../models/paymentRequest')

const PaymentRequestMail = {
  paymentRequestInitiated: async (user, paymentRequest) => {
    const { email, language, receiveNotifications } = user
    const { title, description, amount, custom_amount, currency, payment_url } = paymentRequest
    const to = email
    
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language || 'en')
    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.created.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(`
      <p>${i18n.__('mail.paymentRequest.created.message', {
              title: title,
              description: description,
              amount: custom_amount ? 'custom amount' : amount,
              currency: currency,
              paymentUrl: payment_url
            })}</p>`)
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  transferInitiatedForPaymentRequest: async (user, paymentRequest, payment_amount, transfer_amount) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    const currencySymbol = currencyInfo[paymentRequest.currency.toLowerCase()]?.symbol || ''
    const { decimalFee } = handleAmount(payment_amount, 8, 'decimal', paymentRequest.currency)

    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.transferInitiated.subject'),
        [
          {
            type: 'text/html',
            value: TableTemplate.tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.transferInitiated.message'),
              i18n.__('mail.paymentRequest.transferInitiated.details', {
                title: paymentRequest.title,
                description: paymentRequest.description,
                currency: paymentRequest.currency
              }),
             {
                headers: ['Item', '<div style="text-align:right">Amount</div>'],
                rows: [
                  ['Payment amount', `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`],
                  ['Platform Fee (8%)', `<div style="text-align:right">- ${currencySymbol} ${decimalFee}</div>`],
                  ['Total', `<div style="text-align:right"><strong>${currencySymbol} ${transfer_amount}</strong></div>`]
                ]
              },
              `<div style="text-align: right">${i18n.__('mail.paymentRequest.transferInitiated.bottom')}</div>`
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  paymentMadeForPaymentRequest: async (user, paymentRequestPayment) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)
    const currencySymbol = currencyInfo[paymentRequestPayment.currency.toLowerCase()]?.symbol || ''
    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: TableTemplate.tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.message', {
                amount: paymentRequestPayment.amount,
                currency: paymentRequestPayment.currency
              }),
              i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.details', {
                title: paymentRequestPayment.PaymentRequest.title,
                description: paymentRequestPayment.PaymentRequest.description,
                amount: paymentRequestPayment.amount,
                currency: paymentRequestPayment.currency,
                customer_name: paymentRequestPayment.PaymentRequestCustomer?.name || 'N/A',
                customer_email: paymentRequestPayment.PaymentRequestCustomer?.email || 'N/A'
              }),
             {
                headers: ['Item', 'status', '<div style="text-align:right">Amount</div>'],
                rows: [
                  ['Payment for Payment Request', paymentRequestPayment.status, `<div style="text-align:right">${currencySymbol} ${paymentRequestPayment.amount}</div>`]
                ]
              },
              `<div style="text-align: right">${i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.bottom')}</div>`
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}


module.exports = PaymentRequestMail
