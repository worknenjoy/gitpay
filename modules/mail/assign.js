const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

let AssignMail = {};

AssignMail.success = (to, task, name) => {

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
            <p>Olá, ${name} tem interesse na sua tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a></p>
            <p>Você pode atribuir o desenvolvimento desta tarefa para ele indo na aba 'INTERESSADOS', para que ela possa receber o valor após a tarefa for integrada</p>
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
          subject: "Tivemos problema com alguma das notificações sobre interessados em tarefa no Gitpay"
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
      },
      content: [
        {
          type: 'text/html',
          value: msg
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

module.exports = AssignMail;


