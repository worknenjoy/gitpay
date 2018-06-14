'use strict';
const Promise = require('bluebird');
const models = require('../../../loading/loading');
const SendMail = require('../../mail/mail');

const FAILED_REASON = {
  'declined_by_network': 'Negado pela operadora do cartão'
}

exports.updateWebhook = (req, res) => {
  if(req.body.object == 'event') {
    const event = req.body;
    const paid = event.data.object.paid || false;
    const status = event.data.object.status;
    switch (event.type) {
      case "charge.updated":
           models.Order.update({
             paid: paid,
             status: status
           }, {
             where: {
               source_id: event.data.object.source.id,
               source: event.data.object.id
             },
             returning: true
           }).then((order) => {
             if(order[0]) {
                models.User.findOne({
                  where: {
                    id: order[1][0].dataValues.userId
                  }
                }).then((user) => {
                  if(user) {
                    if (paid && status === 'succeeded'){
                      SendMail.success(user.dataValues.email, 'O pagamento da sua tarefa no Gitpay foi atualizado!', `
                      <p>O pagamento no valor de $${event.data.object.amount / 100} para uma tarefa no Gitpay foi aprovado</p>
                      `);
                    }
                  }
                });
             }
           });
       break;
      case "charge.failed":
        models.Order.update({
          paid: paid,
          status: status
        }, {
          where: {
            source_id: event.data.object.source.id,
            source: event.data.object.id
          },
          returning: true
        }).then((order) => {
          if(order[0]) {
            models.User.findOne({
              where: {
                id: order[1][0].dataValues.userId
              }
            }).then((user) => {
              if(user) {
                if (status === 'failed'){
                  SendMail.error(user.dataValues.email, 'O pagamento da sua tarefa no Gitpay não foi autorizado', `
                      <p>O pagamento no valor de $${event.data.object.amount / 100} para uma tarefa no Gitpay não foi aprovado</p>
                      <p>Motivo: ${FAILED_REASON[event.data.object.outcome.network_status]}</p>
                      `);
                }
              }
            });
          }
        });
      break;
      case "transfer.created":
        models.Task.findOne({
          where: {
            transfer_id: event.data.object.id
          },
          include: [models.User]
        }).then((task) => {
          if(task) {
            models.Assign.findOne({
              where: {
                id: task.dataValues.assigned
              },
              include: [models.User]
            }).then((assigned) => {
              SendMail.success(assigned.dataValues.User.dataValues.email, 'Uma transferência do Gitpay está a caminho!', `
                      <p>Uma transferência no valor de $${event.data.object.amount / 100} foi enviado para sua conta e avisaremos quando for concluída</p>
                      <p>Ela corresponde a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.id}">${process.env.FRONTEND_HOST}/#/task/${task.id}</a> que você concluiu</p>
              `);
            }).catch((e) => {
                console.log('assign find issue', e);
            });
          }
        })

        break;
      default:
        break;
    }
    return res.json(req.body);
  } else {
    res.send(false);
  }
}
