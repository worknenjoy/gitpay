const models = require('../../../loading/loading')
const SendMail = require('../../mail/mail')

const FAILED_REASON = {
  declined_by_network: 'Negado pela operadora do cartão'
}

exports.updateWebhook = (req, res) => {
  if (req.body.object === 'event') {
    const event = req.body
    const paid = event.data.object.paid || false
    const status = event.data.object.status

    switch (event.type) {
      case 'customer.source.created':
        return models.User.findOne({
          where: {
            customer_id: event.data.object.customer
          },
          attributes: ['email']
        }).then((user) => {
          if (!user) {
            return res.status(400).send({ errors: ['User not found'] })
          }
          SendMail.success(
            user.dataValues.email,
            'Um pagamento foi realizado com o seu cartão de crédito',
            `<p>Um pagamento por uma tarefa foi realizado com o seu cartão de crédito. Quando a tarefa for concluída você poderá enviar o pagamento para quem realizou a tarefa.</p>
            <p>Nome do Titular: ${event.data.object.name}</p>
            <p>Últimos 4 dígitos do cartão: ${event.data.object.last4}</p>`
          )
          return res.json(req.body)
        }).catch(error => res.status(400).send(error))
        /* eslint-disable no-unreachable */
        break
      case 'charge.updated':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              return models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              })
                .then(user => {
                  if (user) {
                    if (paid && status === 'succeeded') {
                      SendMail.success(
                        user.dataValues.email,
                        'O pagamento da sua tarefa no Gitpay foi atualizado!',
                        `
                  <p>O pagamento no valor de $${event.data.object.amount /
                    100} para uma tarefa no Gitpay foi aprovado</p>
                  `
                      )
                    }
                  }

                  return res.json(req.body)
                })
                .catch(e => {
                  return res.status(400).send(e)
                })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })
        break
      case 'charge.succeeded':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              return models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              })
                .then(user => {
                  if (user) {
                    if (paid && status === 'succeeded') {
                      SendMail.success(
                        user.dataValues.email,
                        'O pagamento da sua tarefa no Gitpay foi aprovado!',
                        `
                      <p>O pagamento no valor de $${event.data.object.amount /
                        100} para uma tarefa no Gitpay foi aprovado</p>
                      `
                      )
                    }
                  }

                  return res.json(req.body)
                })
                .catch(e => {
                  return res.status(400).send(e)
                })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'charge.failed':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              }).then(user => {
                if (user) {
                  if (status === 'failed') {
                    SendMail.error(
                      user.dataValues.email,
                      'O pagamento da sua tarefa no Gitpay não foi autorizado',
                      `
                      <p>O pagamento no valor de $${event.data.object.amount /
                        100} para uma tarefa no Gitpay não foi aprovado</p>
                      <p>Motivo: ${
  FAILED_REASON[event.data.object.outcome.network_status]
}</p>
                      `
                    )
                    return res.json(req.body)
                  }
                }
              })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'transfer.created':
        return models.Task.findOne({
          where: {
            transfer_id: event.data.object.id
          },
          include: [models.User]
        }).then(task => {
          if (task) {
            return models.Assign.findOne({
              where: {
                id: task.dataValues.assigned
              },
              include: [models.User]
            })
              .then(assigned => {
                SendMail.success(
                  assigned.dataValues.User.dataValues.email,
                  'Uma transferência do Gitpay está a caminho!',
                  `
                      <p>Uma transferência no valor de $${event.data.object
    .amount /
                        100} foi enviado para sua conta e avisaremos quando for concluída</p>
                      <p>Ela corresponde a tarefa <a href='${
  process.env.FRONTEND_HOST
}/#/task/${task.id}'>${
  process.env.FRONTEND_HOST
}/#/task/${task.id}</a> que você concluiu</p>
              `
                )
                return res.json(req.body)
              })
              .catch(e => {
                return res.status(400).send(e)
              })
          }
        })

        break
      case 'payout.created':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              const date = new Date(event.data.object.arrival_date * 1000)
              SendMail.success(
                user.dataValues.email,
                'Uma transferência do Gitpay está a caminho da sua conta!',
                `
                    <p>Uma transferência no valor de ${
  event.data.object.currency
} ${event.data.object.amount /
                  100} está a caminho da sua conta e avisaremos quando for concluída</p>
                    <p>A previsão é de que ela chege em ${date}</p>
            `
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.created', e)
            return res.status(400).send(e)
          })

        break
      case 'payout.failed':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              SendMail.success(
                user.dataValues.email,
                'Ocorreu uma falha no pagamento da sua tarefa no Gitpay',
                `
                <p>O pagamento no valor de $${event.data.object.amount /
                  100} para uma tarefa no Gitpay não foi processada e será feito uma nova tentativa de transferência</p>
                `
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.failed', e)
            return res.status(400).send(e)
          })
        break
      case 'payout.paid':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              const date = new Date(event.data.object.arrival_date * 1000)
              SendMail.success(
                user.dataValues.email,
                'Uma transferência do Gitpay foi realizada para sua conta!',
                `
                    <p>Uma transferência no valor de ${
  event.data.object.currency
} ${event.data.object.amount /
                  100} para a sua conta foi concluída</p>
                    <p>Ela foi realizada em ${date}</p>
            `
              )
              return res.json(req.body)
            }
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on payout.created', e)
            return res.status(400).send(e)
          })

        break
        case 'balance.available':
            SendMail.success(
              'notifications@gitpay.me',
              'Um novo balanço da sua conta no Gitpay',
              `
                  <p>Temos um novo balanço para a conta do Gitpay:</p>
                  <ul>
                  ${event.data.object.available.map(b=> `<li>${b.currency}: ${b.amount}</li>`).join('')}
                  </ul>              
              `)
            return res.json(req.body);
        break
      default:
        return res.status(400).send({
          error: {
            message: 'Not recognized event type'
          }
        })
        break
    }
  }
  else {
    return res.send(false)
  }
}
