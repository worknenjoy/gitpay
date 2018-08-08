const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')

const TransferMail = {
  success: (to, task, value) => {},
  notifyOwner: (to, task, value) => {},
  error: (to, task, value) => {},  
  payment_for_invalid_account: (to) => {},
  future_payment_for_invalid_account: (to) => {}
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

  TransferMail.payment_for_invalid_account = (to) => {
    request(
      to,
      'Ativar conta para receber pagamento',
      [
        {
          type: 'text/html',
          value: `
          <p>Você recebeu um pagamento pelo Gitpay, mas sua conta para recebimento ainda não foi configurada, por favor ative sua conta em <a href="https://gitpay.me/#/profile/payment-options">https://gitpay.me/#/profile/payment-options</a> para poder receber os valores</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  TransferMail.future_payment_for_invalid_account = (to) => {
    request(
      to,
      'Ativar conta para receber futuros pagamentos',
      [
        {
          type: 'text/html',
          value: `
          <p>Para receber um pagamento de uma tarefa com recompensa, você precisa ativar sua conta em <a href="https://gitpay.me/#/profile/payment-options">https://gitpay.me/#/profile/payment-options</a>.</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }
}

module.exports = TransferMail
