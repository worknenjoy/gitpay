import i18n from 'i18n'
import request from './request'
import { handleAmount } from '../util/handle-amount/handle-amount'
import moment from 'moment'
import { tableContentEmailTemplate } from './templates/table-content'
import currencyInfo from '../util/currency-info'

const PayoutMail: any = {
  payoutCreated: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = handleAmount(payout.amount, 0, 'centavos', payout.currency).decimal

    const currency = payout.currency?.toLowerCase?.() || 'usd'
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    try {
      return await request(email, i18n.__('mail.webhook.payout.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            '',
            i18n.__('mail.webhook.payout.intransit.message'),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.webhook.payout.intransit.payout'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.webhook.payout.intransit.details', {
              date: moment(payout.arrival_date * 1000).format('LLL')
            })
          )
        }
      ])
    } catch (error) {
      console.error('Error sending payout created email:', error)
    }
  },
  payoutUpdated: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = handleAmount(payout.amount, 0, 'centavos', payout.currency).decimal

    const currency = payout.currency?.toLowerCase?.() || 'usd'
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    try {
      return await request(email, i18n.__('mail.webhook.payout.updated.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            '',
            i18n.__('mail.webhook.payout.updated.message'),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.webhook.payout.updated.payout'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            payout.reference_number
              ? i18n.__('mail.webhook.payout.updated.details.trace_available', {
                  traceId: payout.reference_number
                })
              : i18n.__('mail.webhook.payout.updated.details.no_trace')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending payout created email:', error)
    }
  },
  payoutPaid: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = handleAmount(payout.amount, 0, 'centavos', payout.currency).decimal

    const currency = payout.currency?.toLowerCase?.() || 'usd'
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    try {
      return await request(email, i18n.__('mail.webhook.payout.finished.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            '',
            i18n.__('mail.webhook.payout.finished.message'),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.webhook.payout.finished.payout'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.webhook.payout.finished.details')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending payout created email:', error)
    }
  },
  payoutFailed: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = handleAmount(payout.amount, 0, 'centavos', payout.currency).decimal

    const currency = payout.currency?.toLowerCase?.() || 'usd'
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    try {
      return await request(email, i18n.__('mail.webhook.payout.fail.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            '',
            i18n.__('mail.webhook.payout.fail.message'),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.webhook.payout.fail.payout'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.webhook.payout.fail.details')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending payout created email:', error)
    }
  }
}

export default PayoutMail
