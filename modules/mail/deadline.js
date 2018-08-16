const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
let dateFormat = require('dateformat')
let moment = require('moment')
let ptLocale = require('moment/locale/pt-br')

moment.locale('pt-br', ptLocale)

const DeadlineMail = {
  update: (to, task, name) => {},
  daysLeft: (to, task, name) => {},
  error: (msg) => {}
}

if (constants.canSendEmail) {
  DeadlineMail.update = (to, task, name) => {
    request(
      to,
      'O prazo para conclusão de uma tarefa do Gitpay foi atualizada',
      [
        {
          type: 'text/html',
          value: `
          <p>Olá ${name},</p>
          <p>A tarefa que você está trabalhando <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> teve o prazo atualizado.</p>
          <p>O prazo para conclusão foi definido para: <strong>${task.deadline ? dateFormat(task.deadline, constants.dateFormat) : 'Nenhum prazo foi definido'}</strong></p>
          <p>Isto signifca que você teria que enviar uma solução <strong>${task.deadline ? moment(task.deadline).fromNow() : 'o tempo que for necessário para terminar'} a partir de agora</strong>.</p>
          <p>Por favor, nos avise se o prazo não poder ser cumprido para que possa ser revisto.</p>
          <p>${Signatures.sign}</p>`
        },
      ]
    )
  }

  DeadlineMail.daysLeft = (to, task, name) => {
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

  DeadlineMail.error = (msg) => {
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

module.exports = DeadlineMail
