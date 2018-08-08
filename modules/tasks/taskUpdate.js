const AssignMail = require('../mail/assign')
const PaymentMail = require('../mail/payment')
const SendMail = require('../mail/mail')
const Promise = require('bluebird')
const models = require('../../loading/loading')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const TransferMail = require('../mail/transfer')
const assignExist = require('../assigns').assignExists

const createSourceAndCharge = Promise.method((customer, orderParameters, order, task, user) => {
  return stripe.customers.createSource(customer.id, { source: orderParameters.source_id }).then(card => {
    return stripe.charges.create({
      amount: orderParameters.amount * 100,
      currency: orderParameters.currency,
      customer: customer.id,
      source: card.id,
      transfer_group: `task_${task.dataValues.id}`,
      metadata: { order_id: order.dataValues.id }
    }).then(charge => {
      if (charge) {
        return order.updateAttributes({
          source: charge.id,
          source_id: card.id,
          paid: charge.paid,
          status: charge.status
        }).then(updatedUser => {
          PaymentMail.success(user.email, task, order.amount)
          if(task.dataValues.assigned) {
            const assignedId = task.dataValues.assigned
            return models.Assign.findById(assignedId, {
              include: [models.User]
            }).then(assign => {
              PaymentMail.assigned(assign.dataValues.User.dataValues.email, task, order.amount)
              return task
            })
          }
          return task
        })
      }
      throw new Error('no charge')
    })
  })
})

const createCustomer = Promise.method((orderParameters, order, task, user) => {
  return stripe.customers.create({
    email: orderParameters.email
  }).then(customer => {
    if (order.userId) {
      return models.User.update({ customer_id: customer.id }, { where: { id: order.userId } }).then(update => {
        if (!update) {
          throw new Error('user not updated')
        }
        return createSourceAndCharge(customer, orderParameters, order, task, user)
      })
    }
    return createSourceAndCharge(customer, orderParameters, order, task, user)
  })
})

module.exports = Promise.method(function taskUpdate (taskParameters) {
  return models.Task
    .update(taskParameters, {
      where: {
        id: taskParameters.id,
      },
      include: [models.User, models.Order]
    }).then((data) => {
      if (!data) {
        return new Error('task_updated_failed')
      }
      return models.Task.findById(taskParameters.id, { include: [ models.User, models.Order, models.Assign ] })
        .then((task) => {
          if (!task) {
            return new Error('task_find_failed')
          }
          if (taskParameters.Orders) {
            return task.createOrder(taskParameters.Orders[0]).then((order) => {
              const orderParameters = taskParameters.Orders[0]
              if (order.userId) {
                return models.User.findById(order.userId).then((user) => {
                  if (user && user.dataValues.customer_id) {
                    return stripe.customers.retrieve(user.customer_id).then((customer) => {
                      return createSourceAndCharge(customer, orderParameters, order, task, user.dataValues)
                    })
                  }
                  else {
                    return createCustomer(orderParameters, order, task, user.dataValues)
                  }
                })
              }
              else {
                return createCustomer(orderParameters, order, task, { email: taskParameters.Orders[0].email })
              }
            })
          }
          
          if (taskParameters.Assigns) {
            assignExist({
              userId: taskParameters.Assigns[0].userId,
              taskId: taskParameters.id
            }).then(resp => {
              if (!resp) {
                return task.createAssign(taskParameters.Assigns[0]).then(assign => {                  
                  if (assign) {
                    return models.User.findOne({
                      where: {
                        id: assign.dataValues.userId
                      }
                    }).then((user) => {
                      const usermail = user.dataValues.email
                      if (!usermail) {
                        AssignMail.error('Alguém registrou interesse mas não recebeu o email da tarefa' + task.dataValues)
                      }
                      if (!user.account_id) {                        
                        TransferMail.future_payment_for_invalid_account(user.email)
                      }
                      AssignMail.interested(usermail, task.dataValues, user.username)
                      if (task.dataValues.User) {
                        AssignMail.owner(task.dataValues.User.dataValues.email, task.dataValues, user.username)
                      }
                      return task.dataValues
                    })
                  }
                })
              }
            })
          }
          if (taskParameters.assigned) {
            return models.Assign.findOne({
              where: {
                id: taskParameters.assigned
              },
              include: [models.User]
            }).then((assigned) => {
              SendMail.success(assigned.dataValues.User.dataValues.email, 'Você foi escolhido para iniciar uma tarefa no Gitpay', `
                    <p>Você foi escolhido para começar com a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.dataValues.id}">${process.env.FRONTEND_HOST}/#/task/${task.dataValues.id}</a> no Gitpay</p>
                    <p>Isto quer dizer que você já pode começar. Fique de olho no prazo para conclusão, e após a tarefa for integrada você receberá o pagamento na sua conta cadastrada.</p>
              `)
              return task.dataValues
            })
          }
          return task.dataValues
        })
    })
})
