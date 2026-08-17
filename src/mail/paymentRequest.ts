import request from './request'
import i18n from 'i18n'
import moment from 'moment'
import formatDate from '../utils/date/formatDate'
import emailTemplate from './templates/base-content'
import { tableContentEmailTemplate } from './templates/table-content'
import currencyInfo from '../utils/currency/currency-info'
import { calculateAmountWithPercent } from '../utils'
import { sanitizePaymentRequestInstructionsContent } from '../utils/sanitize/paymentRequestInstructions'

type CurrencyKey = keyof typeof currencyInfo

const resolveCurrencyKey = (code: any): CurrencyKey => {
  if (typeof code === 'string') {
    const lowered = code.toLowerCase()
    if (Object.prototype.hasOwnProperty.call(currencyInfo, lowered)) {
      return lowered as CurrencyKey
    }
  }
  return 'usd'
}

type StatusChipVariant = 'pending' | 'success'

const statusChipStyles: Record<StatusChipVariant, { bg: string; color: string; border: string }> = {
  pending: { bg: '#fff3cd', color: '#856404', border: '#ffeeba' },
  success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
}

const renderStatusChip = (label: string, variant: StatusChipVariant): string => {
  const { bg, color, border } = statusChipStyles[variant]
  return `<span style="display:inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; background: ${bg}; color: ${color}; border: 1px solid ${border};">${label}</span>`
}

const getReason = (reason_details: any) => {
  switch (reason_details) {
    case 'product_not_received':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.product_not_received'
      )
    case 'product_unacceptable':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.product_unacceptable'
      )
    case 'payment_request_payment_applied':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.payment_request_payment_applied'
      )
    case 'refund_payment_request_requested_by_customer':
      return i18n.__(
        'mail.paymentRequest.newBalanceTransactionForPaymentRequest.reasons.refund_payment_request'
      )
    case 'manual_payment_for_credit_due':
      return 'Manual payment for credit due'
    default:
      return reason_details
  }
}

const getStatusClosedLabel = (status: any) => {
  switch (status) {
    case 'won':
      return i18n.__('mail.paymentRequest.newDisputeClosedForPaymentRequest.status.won')
    case 'lost':
      return i18n.__('mail.paymentRequest.newDisputeClosedForPaymentRequest.status.lost')
    default:
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'
  }
}

const getStatusLabel = (status: any) => {
  switch (status) {
    case 'needs_response':
      return i18n.__(
        'mail.paymentRequest.newDisputeCreatedForPaymentRequest.reasons.needs_response'
      )
    default:
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'
  }
}

const PaymentRequestMail = {
  paymentRequestInitiated: async (user: any, paymentRequest: any) => {
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
    user: any,
    paymentRequest: any,
    payment_amount: any,
    transfer_amount: any,
    extraFee: any,
    paymentRequestPayment?: any
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    const currencyKey = resolveCurrencyKey(paymentRequest?.currency)
    const currencySymbol = currencyInfo[currencyKey]?.symbol || ''

    const grossAmount =
      paymentRequestPayment?.amount != null ? Number(paymentRequestPayment.amount) : null
    const netAfterWhopFee =
      paymentRequestPayment?.amount_after_fees != null
        ? Number(paymentRequestPayment.amount_after_fees)
        : null
    const hasWhopFee =
      paymentRequest?.provider === 'whop' &&
      grossAmount != null &&
      netAfterWhopFee != null &&
      grossAmount > netAfterWhopFee
    const whopFeeAmount = hasWhopFee ? grossAmount - netAfterWhopFee : null

    const whopFeeRows: any[] = hasWhopFee
      ? [
          [
            'Amount Charged',
            `<div style="text-align:right">${currencySymbol} ${grossAmount}</div>`
          ],
          ['Whop Fee', `<div style="text-align:right">- ${currencySymbol} ${whopFeeAmount}</div>`]
        ]
      : []

    // Derive the displayed fee by subtraction from the final total (rather than
    // recomputing 8%) so the rows always reconcile exactly with the Claims-page value,
    // regardless of the rounding mode used to arrive at that total.
    const totalForFeeCalc = extraFee ? Number(extraFee.total) : Number(transfer_amount)
    const platformFeeDisplay = calculateAmountWithPercent(
      Number(payment_amount) - totalForFeeCalc,
      0,
      'decimal',
      paymentRequest.currency
    ).decimal

    let rows: any[] = []
    if (extraFee) {
      rows = [
        ...whopFeeRows,
        [
          'Payment amount',
          `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`
        ],
        [
          'Platform Fee (8%)',
          `<div style="text-align:right">- ${currencySymbol} ${platformFeeDisplay}</div>`
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
        ...whopFeeRows,
        [
          'Payment amount',
          `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`
        ],
        [
          'Platform Fee (8%)',
          `<div style="text-align:right">- ${currencySymbol} ${platformFeeDisplay}</div>`
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
          value: tableContentEmailTemplate(
            i18n.__('mail.paymentRequest.transferInitiated.message'),
            i18n.__('mail.paymentRequest.transferInitiated.details', {
              title: paymentRequest.title,
              description: paymentRequest.description,
              currency: paymentRequest.currency,
              statusChip: renderStatusChip('Payout Initiated', 'success')
            }),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: rows
            },
            i18n.__('mail.paymentRequest.transferInitiated.bottom'),
            {
              link: 'https://gitpay.me/#/profile/claims',
              text: i18n.__('mail.paymentRequest.transferInitiated.cta')
            }
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  transferPendingForPaymentRequest: async (
    user: any,
    paymentRequest: any,
    payment_amount: any,
    pending_amount: any,
    paymentRequestPayment?: any
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    const currencyKey = resolveCurrencyKey(paymentRequest?.currency)
    const currencySymbol = currencyInfo[currencyKey]?.symbol || ''

    const grossAmount =
      paymentRequestPayment?.amount != null ? Number(paymentRequestPayment.amount) : null
    const netAfterWhopFee =
      paymentRequestPayment?.amount_after_fees != null
        ? Number(paymentRequestPayment.amount_after_fees)
        : null
    const hasWhopFee =
      paymentRequest?.provider === 'whop' &&
      grossAmount != null &&
      netAfterWhopFee != null &&
      grossAmount > netAfterWhopFee
    const whopFeeAmount = hasWhopFee ? grossAmount - netAfterWhopFee : null

    const whopFeeRows: any[] = hasWhopFee
      ? [
          [
            'Amount Charged',
            `<div style="text-align:right">${currencySymbol} ${grossAmount}</div>`
          ],
          ['Whop Fee', `<div style="text-align:right">- ${currencySymbol} ${whopFeeAmount}</div>`]
        ]
      : []

    // Same reconciliation approach as transferInitiatedForPaymentRequest: derive the fee
    // row by subtraction from pending_amount so it matches the Claims-page value exactly.
    const platformFeeDisplay = calculateAmountWithPercent(
      Number(payment_amount) - Number(pending_amount),
      0,
      'decimal',
      paymentRequest.currency
    ).decimal

    const rows: any[] = [
      ...whopFeeRows,
      ['Payment amount', `<div style="text-align:right">${currencySymbol} ${payment_amount}</div>`],
      [
        'Platform Fee (8%)',
        `<div style="text-align:right">- ${currencySymbol} ${platformFeeDisplay}</div>`
      ],
      [
        'Estimated Payout (pending)',
        `<div style="text-align:right"><strong>${currencySymbol} ${pending_amount}</strong></div>`
      ]
    ]

    try {
      return await request(to, i18n.__('mail.paymentRequest.transferPending.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.paymentRequest.transferPending.message'),
            i18n.__('mail.paymentRequest.transferPending.details', {
              title: paymentRequest.title,
              description: paymentRequest.description,
              currency: paymentRequest.currency,
              statusChip: renderStatusChip('Pending — Processing', 'pending')
            }),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: rows
            },
            i18n.__('mail.paymentRequest.transferPending.bottom'),
            {
              link: 'https://gitpay.me/#/profile/claims',
              text: i18n.__('mail.paymentRequest.transferPending.cta')
            }
          )
        }
      ])
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  paymentMadeForPaymentRequest: async (user: any, paymentRequestPayment: any) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)
    const currencyKey = resolveCurrencyKey(paymentRequestPayment?.currency)
    const currencySymbol = currencyInfo[currencyKey]?.symbol || ''
    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: tableContentEmailTemplate(
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
              i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.bottom'),
              {
                link: 'https://gitpay.me/#/profile/payment-requests',
                text: i18n.__('mail.paymentRequest.paymentMadeForPaymentRequest.cta')
              }
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },

  sendConfirmationWithInstructions: async (paymentRequestPayment: any) => {
    const paymentRequest = paymentRequestPayment?.PaymentRequest
    const customer = paymentRequestPayment?.PaymentRequestCustomer
    const to = customer?.email

    if (!to) {
      return
    }

    if (!paymentRequest?.send_instructions_email) {
      return
    }

    const instructionsRaw = paymentRequest?.instructions_content
    if (!instructionsRaw) {
      return
    }

    // We don't have a customer language here; default to English for now.
    i18n.setLocale('en')

    const currencyKey = resolveCurrencyKey(paymentRequestPayment?.currency)
    const currencySymbol = currencyInfo[currencyKey]?.symbol || ''

    const instructionsHtml = sanitizePaymentRequestInstructionsContent(instructionsRaw, {
      lengthMode: 'truncate'
    })

    if (!instructionsHtml) {
      return
    }

    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.sendConfirmationWithInstructions.subject', {
          title: paymentRequest?.title || 'a service'
        }),
        [
          {
            type: 'text/html',
            value: tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.sendConfirmationWithInstructions.message', {
                amount: paymentRequestPayment.amount,
                currency: paymentRequestPayment.currency
              }),
              i18n.__('mail.paymentRequest.sendConfirmationWithInstructions.details', {
                title: paymentRequest?.title,
                description: paymentRequest?.description,
                customer_name: customer?.name || 'N/A',
                customer_email: customer?.email || 'N/A'
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
              `${i18n.__('mail.paymentRequest.sendConfirmationWithInstructions.instructions_title')}<br/>${instructionsHtml}`
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  newBalanceTransactionForPaymentRequest: async (
    user: any,
    paymentRequestPayment: any,
    balanceTransaction: any,
    source?: string
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    const customer = paymentRequestPayment?.PaymentRequestCustomer
    let sourceDetails = ''
    if (customer) {
      sourceDetails = `${customer.name || 'N/A'} (${customer.email || 'N/A'})`
    } else if (source) {
      sourceDetails = source
    }

    const balanceAmount = Number(balanceTransaction.PaymentRequestBalance.balance)
    const balanceLabel =
      balanceAmount < 0
        ? 'Current debt balance'
        : balanceAmount > 0
          ? 'Current credit balance'
          : 'Balance'

    const debitNote =
      balanceTransaction.type === 'DEBIT'
        ? `<br/><p>${i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.debit_note')}</p>`
        : ''

    try {
      return await request(
        to,
        i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: tableContentEmailTemplate(
              i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.message'),
              i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.details', {
                type: balanceTransaction.type,
                reason: balanceTransaction.reason,
                reason_details: getReason(balanceTransaction.reason_details),
                status: balanceTransaction.status,
                customer_name: customer ? customer.name || 'N/A' : sourceDetails,
                customer_email: customer ? customer.email || 'N/A' : '',
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
                    `<div style="text-align:right">${calculateAmountWithPercent(balanceTransaction.amount, 0, 'centavos').decimal} ${balanceTransaction.currency}</div>`
                  ],
                  [
                    balanceLabel,
                    `<div style="text-align:right">${calculateAmountWithPercent(balanceTransaction.PaymentRequestBalance.balance, 0, 'centavos').decimal} ${balanceTransaction.currency}</div>`
                  ]
                ]
              },
              `<div style="text-align: right">${i18n.__('mail.paymentRequest.newBalanceTransactionForPaymentRequest.bottom')}</div>${debitNote}`
            )
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  },
  newDisputeCreatedForPaymentRequest: async (
    user: any,
    dispute: any,
    paymentRequestPayment: any
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    try {
      const dp = dispute?.object || dispute
      const currencyKey = resolveCurrencyKey(dp?.currency)
      const currencySymbol = currencyInfo[currencyKey]?.symbol || ''

      const disputedAmount = dp?.amount ?? null
      const feeFromTxn = dp?.balance_transactions?.[0]?.fee
      const netFromTxn = dp?.balance_transactions?.[0]?.net
      const feeFromDetails = dp?.balance_transactions?.[0]?.fee_details?.find?.(
        (f: any) => f?.description === 'Dispute fee'
      )?.amount
      const fee = feeFromTxn as number

      const dueBy = dp?.evidence_details?.due_by
      const dueMoment = dueBy ? moment.unix(dueBy) : null
      const daysToRespond = dueMoment
        ? Math.max(0, Math.ceil(dueMoment.diff(moment(), 'days', true)))
        : null
      const dueFormatted = dueMoment ? dueMoment.format('LLL') : null

      const reason = dp?.reason ? getReason(dp.reason) : 'N/A'

      const platformFee = calculateAmountWithPercent(disputedAmount, 8, 'centavos')

      const rows: any[] = []
      if (typeof disputedAmount === 'number') {
        rows.push([
          'Disputed amount',
          `<div style="text-align:right">${currencySymbol} ${calculateAmountWithPercent(disputedAmount, 0, 'centavos').decimal}</div>`
        ])
      }

      rows.push([
        'Dispute fee',
        `<div style="text-align:right">- ${currencySymbol} ${calculateAmountWithPercent(fee, 0, 'centavos').decimal}</div>`
      ])

      rows.push([
        'Platform fee (8%)',
        `<div style="text-align:right">- ${currencySymbol} ${Math.abs(platformFee.decimalFee)}</div>`
      ])

      const sign = netFromTxn < 0 ? '-' : ''
      rows.push([
        'Net impact',
        `<div style="text-align:right">${sign} ${currencySymbol} ${calculateAmountWithPercent(Math.abs(netFromTxn) + platformFee.centavosFee, 0, 'centavos').decimal}</div>`
      ])

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
            value: tableContentEmailTemplate(
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
  },
  newDisputeClosedForPaymentRequest: async (
    user: any,
    status: any,
    dispute: any,
    paymentRequestPayment: any
  ) => {
    const to = user.email
    const language = user.language || 'en'
    const receiveNotifications = user?.receiveNotifications
    if (!receiveNotifications) {
      return
    }
    i18n.setLocale(language)

    try {
      const dp = dispute

      return await request(
        to,
        i18n.__('mail.paymentRequest.disputeClosedForPaymentRequest.subject'),
        [
          {
            type: 'text/html',
            value: emailTemplate.baseContentEmailTemplate(`
        <p>${i18n.__('mail.paymentRequest.disputeClosedForPaymentRequest.message', {
          status: status ? getStatusClosedLabel(status) : 'N/A'
        })}</p>
        <p>${i18n.__('mail.paymentRequest.disputeClosedForPaymentRequest.details', {
          reason: getReason(dp.reason),
          customer_name:
            paymentRequestPayment?.PaymentRequestCustomer?.name ||
            dp?.evidence?.customer_name ||
            'N/A',
          customer_email:
            paymentRequestPayment?.PaymentRequestCustomer?.email ||
            dp?.evidence?.customer_email_address ||
            'N/A'
        })}</p>
        <p>
          ${
            status === 'won'
              ? i18n.__('mail.paymentRequest.newDisputeClosedForPaymentRequest.reasons.won.details')
              : status === 'lost'
                ? i18n.__(
                    'mail.paymentRequest.newDisputeClosedForPaymentRequest.reasons.lost.details'
                  )
                : ''
          }
        </p>
        <div style="text-align: right">${i18n.__(
          'mail.paymentRequest.disputeClosedForPaymentRequest.bottom'
        )}</div>
      `)
          }
        ]
      )
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}

export default PaymentRequestMail

module.exports = PaymentRequestMail
