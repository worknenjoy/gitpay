const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const moment = require('moment')
const formatDate = require('../util/formatDate').default
const emailTemplate = require('./templates/base-content')
const TableTemplate = require('./templates/table-content')
const currencyInfo = require('../util/currency-info')
const { handleAmount } = require('../util/handle-amount/handle-amount')
const paymentRequest = require('../../models/paymentRequest')

const getReason = (reason_details) => {
  switch (reason_details) {
    case 'product_not_received':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.product_not_received'
      )
    case 'payment_request_payment_applied':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.payment_request_payment_applied'
      )
    case 'refund_payment_request_requested_by_customer':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.refund_payment_request'
      )
    default:
      return reason_details
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'needs_response':
      return i18n.__(
        'mail.paymentRequest.newDisputeCreatedForPaymentRequest.reasons.needs_response'
      )
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

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
      return await request(to, i18n.__('mail.paymentRequest.created.subject'), [
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
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  transferInitiatedForPaymentRequest: async (
    user,
    paymentRequest,
    payment_amount,
    transfer_amount,
    extraFee
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    const currencySymbol = currencyInfo[paymentRequest.currency.toLowerCase()]?.symbol || ''
    const { decimalFee } = handleAmount(payment_amount, 8, 'decimal', paymentRequest.currency)

    let rows = []
    if (extraFee) {
      rows = [
        [
          'Payment amount',
          `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`
        ],
        [
          'Platform Fee (8%)',
          `<div style="text-align:right">- ${currencySymbol} ${decimalFee}</div>`
        ],
        [
          'Balance due',
          `<div style="text-align:right">- ${currencySymbol} ${extraFee.extraFee}</div>`
        ],
        [
          'Total',
          `<div style="text-align:right"><strong>${currencySymbol} ${extraFee.total}</strong></div>`
        ]
      ]
    } else {
      rows = [
        [
          'Payment amount',
          `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`
        ],
        [
          'Platform Fee (8%)',
          `<div style="text-align:right">- ${currencySymbol} ${decimalFee}</div>`
        ],
        [
          'Total',
          `<div style="text-align:right"><strong>${currencySymbol} ${transfer_amount}</strong></div>`
        ]
      ]
    }

    try {
      return await request(to, i18n.__('mail.paymentRequest.transferInitiated.subject'), [
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
              rows: rows
            },
            `<div style="text-align: right">${i18n.__('mail.paymentRequest.transferInitiated.bottom')}</div>`
          )
        }
      ])
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
                  [
                    'Payment for Payment Request',
                    paymentRequestPayment.status,
                    `<div style="text-align:right">${currencySymbol} ${paymentRequestPayment.amount}</div>`
                  ]
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
  },
  newBalanceTransactionForPaymentRequest: async (
    user,
    paymentRequestPayment,
    balanceTransaction
  ) => {
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
        i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: TableTemplate.tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.message'),
              i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.details', {
                type: balanceTransaction.type,
                reason: balanceTransaction.reason,
                reason_details: getReason(balanceTransaction.reason_details),
                status: balanceTransaction.status,
                customer_name: paymentRequestPayment.PaymentRequestCustomer?.name || 'N/A',
                customer_email: paymentRequestPayment.PaymentRequestCustomer?.email || 'N/A',
                opened_at: balanceTransaction.openedAt
                  ? formatDate(balanceTransaction.openedAt)
                  : moment(balanceTransaction.createdAt).format('LLL'),
                closed_at: balanceTransaction.closedAt
                  ? formatDate(balanceTransaction.closedAt)
                  : moment(balanceTransaction.createdAt).format('LLL')
              }),
              {
                headers: ['Item', '<div style="text-align:right">Amount</div>'],
                rows: [
                  [
                    balanceTransaction.reason,
                    `<div style="text-align:right">${handleAmount(balanceTransaction.amount, '0', 'centavos').decimal} ${balanceTransaction.currency}</div>`
                  ],
                  [
                    'Current debt balance',
                    `<div style="text-align:right">${handleAmount(balanceTransaction.PaymentRequestBalance.balance, '0', 'centavos').decimal} ${balanceTransaction.currency}</div>`
                  ]
                ]
              },
              `<div style="text-align: right">${i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.bottom')}</div>`
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  newDisputeCreatedForPaymentRequest: async (user, dispute, paymentRequestPayment) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    try {
      const dp = dispute?.object || dispute
      const currency = dp.currency?.toLowerCase?.() || 'usd'
      const currencySymbol = currencyInfo[currency]?.symbol || ''

      // Monetary values (Stripe amounts are in the smallest unit)
      const disputedAmount = dp?.amount ?? null
      const feeFromTxn = dp?.balance_transactions?.[0]?.fee
      const netFromTxn = dp?.balance_transactions?.[0]?.net
      const feeFromDetails = dp?.balance_transactions?.[0]?.fee_details?.find?.(
        (f) => f?.description === 'Dispute fee'
      )?.amount
      const fee =
        typeof feeFromTxn === 'number'
          ? feeFromTxn
          : typeof feeFromDetails === 'number'
            ? feeFromDetails
            : null

      // Dates and response window
      const dueBy = dp?.evidence_details?.due_by
      const dueMoment = dueBy ? moment.unix(dueBy) : null
      const daysToRespond = dueMoment
        ? Math.max(0, Math.ceil(dueMoment.diff(moment(), 'days', true)))
        : null
      const dueFormatted = dueMoment ? dueMoment.format('LLL') : null

      // Reason mapping using existing helper
      const reason = dp?.reason ? getReason(dp.reason) : 'N/A'

      const rows = []
      if (typeof disputedAmount === 'number') {
        rows.push([
          'Disputed amount',
          `<div style="text-align:right">${currencySymbol} ${handleAmount(disputedAmount, '0', 'centavos').decimal}</div>`
        ])
      }
      if (typeof fee === 'number') {
        rows.push([
          'Dispute fee',
          `<div style="text-align:right">- ${currencySymbol} ${handleAmount(fee, '0', 'centavos').decimal}</div>`
        ])
      }
      if (typeof netFromTxn === 'number') {
        const sign = netFromTxn < 0 ? '-' : ''
        rows.push([
          'Net impact',
          `<div style="text-align:right">${sign} ${currencySymbol} ${handleAmount(Math.abs(netFromTxn), '0', 'centavos').decimal}</div>`
        ])
      }
      if (daysToRespond !== null) {
        rows.push([
          'Days to respond',
          `<div style="text-align:right">${daysToRespond} ${daysToRespond === 1 ? 'day' : 'days'}${dueFormatted ? ` (due ${dueFormatted})` : ''}</div>`
        ])
      }

      return await request(
        to,
        i18n.__('mail.paymentRequest.newDisputeCreatedForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: TableTemplate.tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.newDisputeCreatedForPaymentRequest.message', {
                status: getStatusLabel(dp?.status) || 'N/A'
              }),
              i18n.__('mail.paymentRequest.newDisputeCreatedForPaymentRequest.details', {
                reason: reason,
                customer_name:
                  paymentRequestPayment?.PaymentRequestCustomer?.name ||
                  dp?.evidence?.customer_name ||
                  'N/A',
                customer_email:
                  paymentRequestPayment?.PaymentRequestCustomer?.email ||
                  dp?.evidence?.customer_email_address ||
                  'N/A'
              }),
              {
                headers: ['Item', '<div style="text-align:right">Amount</div>'],
                rows
              },
              `<div style="text-align: right">${i18n.__('mail.paymentRequest.newDisputeCreatedForPaymentRequest.bottom')}</div>`
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
