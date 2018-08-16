const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
let dateFormat = require('dateformat')
let moment = require('moment')
let ptLocale = require('moment/locale/pt-br')

moment.locale('pt-br', ptLocale)

const StatusMail = {
  update: (to, task, name) => {},
  error: (msg) => {}
}

const STATUSES = {
  'open': 'Aberta',
  'OPEN': 'Aberta',
  'in_progress': 'Em desenvolvimento',
  'closed': 'Finalizada',
  '': 'Status indefinido',
  null: 'Status indefinido',
  undefined: 'Status indefinido'
}

if (constants.canSendEmail) {
  StatusMail.update = (to, task, name) => {
    request(
      to,
      'O status de uma tarefa que você foi escolhido foi atualizado no Gitpay',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${name},</p>
          <p>A tarefa que você está trabalhando <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> teve o status atualizado.</p>
          <p>Agora a tarefa está <strong>${STATUSES[task.status]}</strong></p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  StatusMail.daysLeft = (to, task, name) => {
    request(
      to,
      `Atenção, faltam ${task.deadline ? moment(task.deadline).fromNow() : 'para finalização de uma tarefa que foi escolhido no Gitpay'}`,
      [
        {
          type: 'text/html',
          value: `
           <p>Olá ${name},</p>
           <p>Você foi escolhido para começar com a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay.</p>
           <p>O prazo para conclusão desta tarefa é: <strong>${task.deadline ? dateFormat(task.deadline, constants.dateFormat) : 'Nenhum prazo foi definido'}</strong></p>
           <p>O que signifca que você teria que enviar uma solução <strong>${task.deadline ? moment(task.deadline).fromNow() : 'o tempo que for necessário para terminar'} a partir de agora</strong></p>
           <p>Por favor, envie seu Pull Request para que a sua solução possa ser avaliada e integrada e assim você poderá receber a recopensa pelo desenvolvimento</p>
           <p>${Signatures.sign}</p>`

        }
      ]
    )
  }

  StatusMail.error = (msg) => {
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

module.exports = StatusMail
