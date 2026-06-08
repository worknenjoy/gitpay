import i18n from 'i18n'
// @ts-ignore - jsonwebtoken has no type definitions
import jwt from 'jsonwebtoken'
import request from '../../request'
import { tableContentEmailTemplate, type ActionButton } from '../table-content'
import currencyInfo from '../../../utils/currency/currency-info'

const ClaimMail: any = {
  notifyUnclaimedBounties: async function (user: any, issue: any, pullRequest: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const currency = 'usd'

    const amount = issue.value
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    const title = issue?.title || ''
    const prURL = pullRequest?.html_url || ''
    const issueOriginalUrl = issue?.url || ''
    const issueUrl = `${process.env.FRONTEND_HOST}/#/task/${issue?.id || ''}`

    const donateToken = jwt.sign(
      { taskId: issue.id, userId: user.id, action: 'donate' },
      process.env.SECRET_PHRASE as string,
      { expiresIn: '30d' }
    )
    const donateUrl = `${process.env.FRONTEND_HOST}/#/task/${issue.id}/donate-to-platform-funds?token=${donateToken}`

    const balanceInfo = i18n.__('mail.issue.claim.balance_info', { currencySymbol, amount })
    const retryWarning = i18n.__('mail.issue.claim.retry_warning')
    const donateCtaText = i18n.__('mail.issue.claim.cta_donate')

    const donateButtonHtml = `<p style="margin: 16px 0 0; text-align: center;"><a href="${donateUrl}" style="font-size: 13px; color: #777; text-decoration: underline;">${donateCtaText}</a></p>`

    try {
      return await request(email, i18n.__('mail.issue.claim.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.issue.claim.intro', {
              name: user.name || user.username || 'Gitpay User'
            }),
            i18n.__('mail.issue.claim.message', {
              title,
              issueUrl,
              issueOriginalUrl,
              prURL
            }) +
              balanceInfo +
              retryWarning,
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.issue.claim.item'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.issue.claim.details', {
              title,
              prURL,
              issueUrl
            }),
            {
              link: issueUrl,
              text: i18n.__('mail.issue.claim.cta')
            } as ActionButton,
            i18n.__('mail.issue.claim.footer') + donateButtonHtml
          )
        }
      ])
    } catch (error) {
      console.error('Error sending unclaimed bounty email:', error)
    }
  },

  notifyDonatedBountyToGitpay: async function (user: any, issue: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const currency = 'usd'
    const amount = issue.value
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''
    const title = issue?.title || ''
    const issueUrl = `${process.env.FRONTEND_HOST}/#/task/${issue?.id || ''}`

    try {
      return await request(email, i18n.__('mail.issue.claim.donated.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.issue.claim.donated.intro', {
              name: user.name || user.username || 'Gitpay User'
            }),
            i18n.__('mail.issue.claim.donated.message', {
              title,
              issueUrl,
              currencySymbol,
              amount
            }),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.issue.claim.donated.item'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.issue.claim.donated.footer')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending donated bounty email:', error)
    }
  }
}

export default ClaimMail
