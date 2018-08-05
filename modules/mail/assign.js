const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')

const AssignMail = {
  owner: (to, task, name) => {},
  interested: (to, task, name) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  AssignMail.owner = (to, task, name) => {
    request(
      to,
      'Alguém tem interesse por uma tarefa que você cadastrou no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá,</p>
          <p>${name} tem interesse na sua tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
          <p>Você pode atribuir o desenvolvimento desta tarefa para ele indo na aba 'INTERESSADOS', para que ela possa receber o valor após a tarefa for integrada.</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  AssignMail.interested = (to, task, name) => {
    request(
      to,
      'Você tem interesse em realizar uma tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${name},</p>
          <p>Você tem interesse em realizar a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay.</p>
          <p>O responsável pela tarefa será notificado e você receberá uma confirmação caso você seja escolhido.</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  AssignMail.error = (msg) => {
    request(
      constants.notificationEmail,
      'Tivemos problema com alguma das notificações sobre interessados em tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: msg
        },
      ]
    )
  }
}

module.exports = AssignMail
