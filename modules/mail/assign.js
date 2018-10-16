const Signatures = require('./content')
const request = require('./request')
const constants = require('./constants')
let dateFormat = require('dateformat')
let moment = require('moment')
let ptLocale = require('moment/locale/pt-br')

moment.locale('pt-br', ptLocale)

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

  AssignMail.assigned = (to, task, name) => {
    request(
      to,
      'Você foi escolhido para iniciar uma tarefa no Gitpay',
      [
        {
          type: 'text/html',
          value: `
           <p>Olá ${name},</p>
           <p>Você foi escolhido para começar com a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay.</p>
           <p>Quem mantém este projeto e criou esta tarefa entrará em contato para maiores detalhes para lhe instruir em como você deve começar.</p>
           <p>O prazo para conclusão desta tarefa é: <strong>${task.deadline ? dateFormat(task.deadline, constants.dateFormat) : 'Nenhum prazo foi definido'}</strong></p>
           <p>O que signifca que você teria que enviar uma solução <strong>${task.deadline ? moment(task.deadline).fromNow() : 'o tempo que for necessário para terminar'} a partir de agora</strong></p>
           <p>Para iniciar, você deve seguir os seguintes passos:</p>
           <ul>
            <li>Criar um fork do projeto</li>
            <li>Seguir as instruções do projeto para rodá-lo localmente</li>
            <li>Desenvolver uma solução e tirar quaisquer dúvidas se necessário</li>
            <li>Sempre estar atualizado com o repositório principal</li>
            <li>Dependendo do projeto, um build é realizado e <strong>você terá que passar nos testes automatizados</strong></li>
            <li>Enviar um <strong>Pull Request</strong></li>
            <li>Ter o seu <strong>código avaliado</strong></li>
           </ul>
           <p>Quando seu Pull Request for integrado, você receberá o valor da recompensa na sua conta cadastrada.</p>
           <p>${Signatures.sign}</p>`

        }
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
