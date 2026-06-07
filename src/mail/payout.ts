import i18n from 'i18n'
import request from './request'
import { calculateAmountWithPercent } from '../utils'
import moment from 'moment'
import { tableContentEmailTemplate } from './templates/table-content'
import baseContentTemplate from './templates/base-content'
import currencyInfo from '../utils/currency/currency-info'

const ACCOUNT_FIELD_LABELS: Record<string, string> = {
  external_account: 'Bank account',
  'individual.address.city': 'City',
  'individual.address.line1': 'Address line 1',
  'individual.address.postal_code': 'Zip code',
  'individual.address.state': 'State',
  'individual.email': 'E-mail',
  'individual.phone': 'Phone number',
  'individual.dob.day': 'Day of birth',
  'individual.dob.month': 'Month of birth',
  'individual.dob.year': 'Year of birth',
  'individual.first_name': 'First name',
  'individual.last_name': 'Last name',
  'individual.personal_id_number': 'ID number',
  'individual.verification.document': 'Document number',
  'individual.type': 'ID type',
  'tos_acceptance.date': 'Terms date',
  'tos_acceptance.ip': 'Terms acceptance',
  'business_profile.url': 'Business URL',
  business_type: 'Business type',
  'business_profile.mcc': 'Business type (MCC)',
  'individual.id_number': 'ID number',
  'individual.ssn_last_4': 'SSN last 4'
}

const PayoutMail: any = {
  payoutCreated: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = calculateAmountWithPercent(payout.amount, 0, 'centavos', payout.currency).decimal

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
            payout.arrival_date
              ? i18n.__('mail.webhook.payout.intransit.details', {
                  date: moment(payout.arrival_date * 1000).format('LLL')
                })
              : ''
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

    const amount = calculateAmountWithPercent(payout.amount, 0, 'centavos', payout.currency).decimal

    const currency = payout.currency?.toLowerCase?.() || 'usd'
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''
    const status = payout.status || 'generic'

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
                  i18n.__(`mail.webhook.payout.updated.payout.${status}`),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            payout.reference_number
              ? i18n.__('mail.webhook.payout.updated.details.trace_available', {
                  traceId: payout.reference_number
                })
              : ''
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

    const amount = calculateAmountWithPercent(payout.amount, 0, 'centavos', payout.currency).decimal

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
  accountRejected: async function (user: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    try {
      return await request(email, i18n.__('mail.webhook.payout.account.rejected.subject'), [
        {
          type: 'text/html',
          value: baseContentTemplate.baseContentEmailTemplate(
            i18n.__('mail.webhook.payout.account.rejected.message'),
            i18n.__('mail.webhook.payout.account.rejected.details')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending account rejected email:', error)
    }
  },
  accountCurrentlyDue: async function (user: any, currentlyDue: string[]) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const requirementsList = `<ul>${currentlyDue.map((r) => `<li>${ACCOUNT_FIELD_LABELS[r] || r}</li>`).join('')}</ul>`

    try {
      return await request(email, i18n.__('mail.webhook.payout.account.currentlydue.subject'), [
        {
          type: 'text/html',
          value: baseContentTemplate.baseContentEmailTemplate(
            i18n.__('mail.webhook.payout.account.currentlydue.message'),
            i18n.__('mail.webhook.payout.account.currentlydue.requirements') +
              requirementsList +
              i18n.__('mail.webhook.payout.account.currentlydue.details')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending account currently due email:', error)
    }
  },
  payoutFailed: async function (user: any, payout: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const amount = calculateAmountWithPercent(payout.amount, 0, 'centavos', payout.currency).decimal

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
