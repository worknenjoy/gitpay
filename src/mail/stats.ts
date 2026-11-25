import request from './request'
import * as constants from './constants'
import i18n from 'i18n'

const StatsMail = {
  newUsers: async (newUsersCount: number, totalUsersCount: number) => {
    // This sends to notificationEmail for administrative purposes,
    // not to end users, so no user preference check is needed
    i18n.setLocale('en')
    const response = await request(
      constants.notificationEmail,
      i18n.__('mail.stats.newUsers.subject', { count: String(newUsersCount) }),
      [
        {
          type: 'text/html',
          value: i18n.__('mail.stats.newUsers.message', {
            count: String(newUsersCount),
            total: String(totalUsersCount)
          })
        }
      ]
    )
    // request() returns SendGrid errors instead of throwing; rethrow so callers
    // (e.g. the Inngest `mail-new-users` step) can fail and retry.
    if (response instanceof Error) {
      throw response
    }
    return response
  }
}

export default StatsMail

module.exports = StatsMail
