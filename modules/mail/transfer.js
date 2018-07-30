const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const Signatures = require('./content')
const constants = require('./constants')

let TransferMail = {
  success: (to, task, value) => {},
  notifyOwner: (to, task, value) => {},
  error: (to, task, value) => {}
}

if (process.env.NODE_ENV !== 'test') {

  TransferMail.success = (to, task, value) => {
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
            subject: 'Uma transferência foi realizado por uma tarefa no Gitpay'
          },
        ],
        from: {
          email: 'tarefas@gitpay.me'
        },
        content: [
          {
            type: 'text/html',
            value: `
            <p>Olá, uma transferência no valor de $ ${value} será realizada para você pela tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
            <p>${Signatures.sign}</p>
          `
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

  TransferMail.notifyOwner = (to, task, value) => {
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
            subject: 'Você confirmou uma transferência por uma tarefa no Gitpay'
          },
        ],
        from: {
          email: 'tarefas@gitpay.me'
        },
        content: [
          {
            type: 'text/html',
            value: `
            <p>Olá, você confirmou uma transferência no valor de $ ${value} pela tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
            <p>${Signatures.sign}</p>
          `
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

  TransferMail.error = (to, task, value) => {
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
            subject: 'Problema na transferência por tarefa no Gitpay'
          },
        ],
        from: {
          email: constants.fromEmail
        },
        content: [
          {
            type: 'text/html',
            value: `
            <p>Olá, tivemos um problema com a transferência de $ ${value} para a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
            <p>${Signatures.sign}</p>
          `
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

module.exports = TransferMail
