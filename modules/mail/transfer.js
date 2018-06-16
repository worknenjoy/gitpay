const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const Signatures = require('./content');

let TransferMail = {};
let bcc = [];

if(process.env.NODE_ENV != 'test') {
  bcc.push({
    email: 'notifications@gitpay.me'
  })
}

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
          bcc: bcc,
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
  });

  sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.body.errors);
      console.log(error.response.statusCode);
    });
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
              email: 'notifications@gitpay.me'
            }
          ],
          subject: "Problema na transferência por tarefa no Gitpay"
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
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
  });

  sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.statusCode);
    });
}

module.exports = TransferMail;


