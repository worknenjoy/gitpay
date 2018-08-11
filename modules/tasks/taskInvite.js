const Promise = require('bluebird')

const models = require('../../loading/loading')
const SendMail = require('../mail/mail')

module.exports = Promise.method(function ({ id }, { message, email }) {
  return models.Task
    .findById(id, { include: [ models.User, models.Order, models.Assign ] })
    .then(task => {
      const taskUrl = `${process.env.FRONTEND_HOST}/#/task/${task.id}`

      SendMail.success(
        email,
        'Você recebeu um convite para trabalhar em uma tarefa do Gitpay :-)',
        `<p>Você foi convidado para trabalhar na tarefa <a href="${taskUrl}">${taskUrl}</a> no <a href="http://gitpay.me">Gitpay</a>.</p>
        <p>
          <strong>Título:</strong> ${task.title} 
        </p>
        <p>
          <strong>Valor:</strong> $ ${task.value} 
        </p>
        <p style="marginBottom: 20px"><a href="${taskUrl}">Saiba mais sobre a tarefa</a> e se tiver interesse, basta clicar em "tenho interesse nesta tarefa", que você poderá ser atribuido </p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
        <p><strong>Por que isso aconteceu?</strong></p>
        <p>Você pode ter sido convidado por ter já realizado uma tarefa para este projeto no passado ou por ser o mais indicado a resolver o problema, de acordo com a opinião de quem o convidou.</p>`
      )
    })
})
