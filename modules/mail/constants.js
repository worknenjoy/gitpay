
module.exports = {
  notificationEmail: 'notifications@gitpay.me',
  fromEmail: 'tarefas@gitpay.me',
  canSendEmail: process.env.NODE_ENV !== 'test' && process.env.SENDGRID_API_KEY,
  dateFormat: 'fullDate',
  taskUrl: (id) => {
    return `${process.env.FRONTEND_HOST}/#/task/${id}`
  },
  groups: {
    onetask: 8241,
    bounties: 11285,
  },
  templates: {
    onetask: 'd-6382a786b0e342fa97122faa039a7301',
    bounties: 'd-b78b1c49a4f64c6c997948b665ae5763'
  }
}
