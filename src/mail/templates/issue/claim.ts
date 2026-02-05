import i18n from 'i18n'
import request from '../../request'
import { tableContentEmailTemplate, type ActionButton } from '../table-content'
import currencyInfo from '../../../utils/currency-info'

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
            }),
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
            i18n.__('mail.issue.claim.footer')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending unclaimed bounty email:', error)
    }
  }
}

export default ClaimMail
