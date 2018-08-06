const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')

const TransferMail = {
  success: (to, task, value) => {},
  notifyOwner: (to, task, value) => {},
  error: (to, task, value) => {}
}

if (constants.canSendEmail) {
  TransferMail.success = (to, task, value) => {
    request(
      to,
      'Uma transferência foi realizado por uma tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá, uma transferência no valor de $ ${value} será realizada para você pela tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  TransferMail.notifyOwner = (to, task, value) => {
    request(
      to,
      'Você confirmou uma transferência por uma tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá, você confirmou uma transferência no valor de $ ${value} pela tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  TransferMail.error = (to, task, value) => {
    request(
      to,
      'Problema na transferência por tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá, tivemos um problema com a transferência de $ ${value} para a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }
}

module.exports = TransferMail
