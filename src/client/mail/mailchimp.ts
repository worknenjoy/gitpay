import Mailchimp from 'mailchimp-api-v3'
import { mailchimp } from '../../config/secrets'

export const mailChimpConnect = (mail: string) => {
  if (!mailchimp.apiKey) {
    return
  }

  const mc = new Mailchimp(mailchimp.apiKey)
  mc.post(`/lists/${mailchimp.listId}/members`, {
    email_address: mail,
    status: 'subscribed'
  })
    .then((results) => {
      // eslint-disable-next-line no-console
      console.log('mailchimp')
      // eslint-disable-next-line no-console
      console.log(results)
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('mailchimp error')
      // eslint-disable-next-line no-console
      console.log(err)
    })
}
