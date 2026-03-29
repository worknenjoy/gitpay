import i18n from 'i18n'
import request from './request'
import { tableContentEmailTemplate, type ActionButton } from './templates/table-content'
import currencyInfo from '../utils/currency/currency-info'

const OpenBountyMail: any = {
  notifyOpenBountyWithMergedPR: async function (user: any, issue: any, pullRequest: any) {
    const { email, language, receiveNotifications } = user || {}
    if (!receiveNotifications) return

    i18n.setLocale(language || 'en')

    const currency = 'usd'
    const amount = issue.value
    const currencySymbol = currencyInfo[currency as keyof typeof currencyInfo]?.symbol || ''

    const title = issue?.title || ''
    const prURL = pullRequest?.html_url || ''
    const prAuthor = pullRequest?.user?.login || ''
    const issueOriginalUrl = issue?.url || ''
    const issueUrl = `${process.env.FRONTEND_HOST}/#/task/${issue?.id || ''}`

    try {
      return await request(email, i18n.__('mail.issue.open.bounty.subject'), [
        {
          type: 'text/html',
          value: tableContentEmailTemplate(
            i18n.__('mail.issue.open.bounty.intro', {
              name: user.name || user.username || 'Gitpay User'
            }),
            i18n.__('mail.issue.open.bounty.message', {
              title,
              issueUrl,
              issueOriginalUrl,
              prURL,
              prAuthor
            }),
            {
              headers: ['Item', '<div style="text-align:right">Amount</div>'],
              rows: [
                [
                  i18n.__('mail.issue.open.bounty.item'),
                  `<div style="text-align:right">${currencySymbol} ${amount}</div>`
                ]
              ]
            },
            i18n.__('mail.issue.open.bounty.details', {
              title,
              prURL,
              issueUrl,
              issueOriginalUrl
            }),
            {
              link: issueUrl,
              text: i18n.__('mail.issue.open.bounty.cta')
            } as ActionButton,
            i18n.__('mail.issue.open.bounty.footer')
          )
        }
      ])
    } catch (error) {
      console.error('Error sending open bounty notification email:', error)
    }
  }
}

export default OpenBountyMail
