export const notificationEmail = 'contact@gitpay.me'
export const copyEmail = 'issues@gitpay.me'
export const recruitersEmail = 'hiringt@gitpay.me'
export const reportEmail = 'alexandre@gitpay.me'
export const fromEmail = 'contact@gitpay.me'
export const joinTeamEmail = 'team@gitpay.me'
export const dateFormat = 'fullDate'

export const taskUrl = (id: number | string): string => {
  return `${process.env.FRONTEND_HOST}/#/task/${id}`
}

export const groups = {
  onetask: 8241,
  bounties: 11285,
  latest: 11286
}

export const templates = {
  onetask: 'd-6382a786b0e342fa97122faa039a7301',
  bounties: 'd-b78b1c49a4f64c6c997948b665ae5763',
  latest: 'd-0decb18add7a4b5f8d501f7e0a630777'
}

// For backwards compatibility
module.exports = {
  notificationEmail,
  copyEmail,
  recruitersEmail,
  reportEmail,
  fromEmail,
  joinTeamEmail,
  dateFormat,
  taskUrl,
  groups,
  templates
}
