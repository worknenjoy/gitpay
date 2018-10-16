const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')

const PaymentMail = {
  success: (to, task, value) => {},
  assigned: (to, task, value) => {},
  error: (to, task, value) => {}
}

if (constants.canSendEmail) {
  PaymentMail.success = (user, task, value) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    request(
      to,
      i18n.__('mail.payment.success.subject'),
      [
        {
          type: 'text/html',
          value: `
          <p>${i18n.__('mail.payment.success.content.main', { value: value, url: `process.env.FRONTEND_HOST}/#/task/${task.id}`}) }</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  PaymentMail.assigned = (to, task, value) => {
    request(
      to,
      'Um pagamento foi realizado por uma tarefa no Gitpay em que você foi atribuído',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá, um pagamento no valor de $ ${value} foi adicionado para a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>Você foi escolhido para resolver esta tarefa. Sendo assim, este valor será transferido para você após a resolução e você será notificado.</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  PaymentMail.error = (to, task, value) => {
    request(
      to,
      'Problema no pagamento por tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá, tivemos um problema com o pagamento de $ ${value} para a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }
}
module.exports = PaymentMail
