const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const Signatures = require('./content')
const constants = require('./constants')

let AssignMail = {
  owner: (to, task, name) => {},
  interested: (to, task, name) => {},
  error: (msg) => {}
}

if (process.env.NODE_ENV !== 'test') {
  AssignMail.owner = (to, task, name) => {
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: to,
              },
            ],
            bcc: [
              {
                email: constants.notificationEmail
              }
            ],
            subject: 'Alguém tem interesse por uma tarefa que você cadastrou no Gitpay'
          },
        ],
        from: {
          email: 'tarefas@gitpay.me'
        },
        content: [
          {
            type: 'text/html',
            value: `
            <p>Olá,</p>
            <p>${name} tem interesse na sua tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
            <p>Você pode atribuir o desenvolvimento desta tarefa para ele indo na aba 'INTERESSADOS', para que ela possa receber o valor após a tarefa for integrada.</p>
              <p>${Signatures.sign}</p>`
          },
        ],
      },
    })

    sg.API(request)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response.statusCode)
        // eslint-disable-next-line no-console
        console.log(response.body)
        // eslint-disable-next-line no-console
        console.log(response.headers)
      })
      .catch(error => {
        // error is an instance of SendGridError
        // The full response is attached to error.response
        // eslint-disable-next-line no-console
        console.log(error.response.body.errors)
        // eslint-disable-next-line no-console
        console.log(error.response.statusCode)
      })
  }

  AssignMail.interested = (to, task, name) => {
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: to,
              },
            ],
            bcc: [
              {
                email: constants.notificationEmail
              }
            ],
            subject: 'Você tem interesse em realizar uma tarefa no Gitpay'
          },
        ],
        from: {
          email: 'tarefas@gitpay.me'
        },
        content: [
          {
            type: 'text/html',
            value: `
            <p>Olá ${name},</p>
            <p>Você tem interesse em realizar a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> no Gitpay.</p>
            <p>O responsável pela tarefa será notificado e você receberá uma confirmação caso você seja escolhido.</p>
              <p>${Signatures.sign}</p>`
          },
        ],
      },
    })

    sg.API(request)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response.statusCode)
        // eslint-disable-next-line no-console
        console.log(response.body)
        // eslint-disable-next-line no-console
        console.log(response.headers)
      })
      .catch(error => {
        // error is an instance of SendGridError
        // The full response is attached to error.response
        // eslint-disable-next-line no-console
        console.log(error.response.body.errors)
        // eslint-disable-next-line no-console
        console.log(error.response.statusCode)
      })
  }

  AssignMail.error = (msg) => {
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: 'notifications@gitpay.me',
              },
            ],
            subject: 'Tivemos problema com alguma das notificações sobre interessados em tarefa no Gitpay'
          },
        ],
        from: {
          email: constants.fromEmail
        },
        content: [
          {
            type: 'text/html',
            value: msg
          },
        ],
      },
    })

    sg.API(request)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response.statusCode)
        // eslint-disable-next-line no-console
        console.log(response.body)
        // eslint-disable-next-line no-console
        console.log(response.headers)
      })
      .catch(error => {
        // error is an instance of SendGridError
        // The full response is attached to error.response
        // eslint-disable-next-line no-console
        console.log(error.response.statusCode)
      })
  }
}

module.exports = AssignMail
