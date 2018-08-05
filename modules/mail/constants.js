const { sendgrid } = require('../../config/secrets')
module.exports = {
  notificationEmail: 'notifications@gitpay.me',
  fromEmail: 'tarefas@gitpay.me',
  canSendEmail: process.env.NODE_ENV !== 'test' && sendgrid.apiKey,
}
