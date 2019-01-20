const AssignMail = require('../mail/assign')
const PaymentMail = require('../mail/payment')
const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)
const TransferMail = require('../mail/transfer')
const DeadlineMail = require('../mail/deadline')
const assignExist = require('../assigns').assignExists
const offerExists = require('../offers').offerExists
const i18n = require('i18n')
const constants = require('../mail/constants')
const TaskMail = require('../mail/task')

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
          PaymentMail.success(user, task, order.amount)
          TaskMail.notifyPayment(task.dataValues.User, {
            task: {
              title: task.dataValues.title,
              value: order.dataValues.amount,
              issue_url: task.dataValues.url,
              url: constants.taskUrl(task.dataValues.id)
            }
          })
          if (task.dataValues.assigned) {
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

const postCreateOrUpdateOffer = Promise.method((task, offer) => {
  if (offer) {
    return models.User.findOne({
      where: {
        id: offer.userId
      }
    }).then((user) => {
      const usermail = user.dataValues.email
      const language = user.language || 'en'
      i18n.setLocale(language)
      if (!usermail) {
        AssignMail.error('mail.assign.register.error' + task.dataValues)
      }
      if (!user.account_id) {
        TransferMail.futurePaymentForInvalidAccount(user)
      }
      AssignMail.interested(user, task.dataValues)
      if (task.dataValues.User) {
        const ownerUser = task.dataValues.User.dataValues
        AssignMail.owner(ownerUser, task.dataValues, user, offer)
      }
      return task.dataValues
    })
  }
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

          if (taskParameters.deadline) {
            if (task.dataValues.assigned) {
              return models.Assign.findOne({
                where: {
                  id: task.dataValues.assigned
                },
                include: [models.User]
              }).then((assigned) => {
                const assignedUserDeadline = assigned.User.dataValues
                DeadlineMail.update(assignedUserDeadline.email, task.dataValues, assignedUserDeadline.username)
                return task.dataValues
              })
            }
          }

          if (taskParameters.Assigns) {
            assignExist({
              userId: taskParameters.Assigns[0].userId,
              taskId: taskParameters.id
            }).then(resp => {
              if (!resp) {
                return task.createAssign(taskParameters.Assigns[0])
              }
            })
          }

          if (taskParameters.Offers) {
            offerExists({
              userId: taskParameters.Offers[0].userId,
              taskId: taskParameters.id
            }).then(resp => {
              if (!resp) {
                return task.createOffer(taskParameters.Offers[0]).then(offer => {
                  return postCreateOrUpdateOffer(task, taskParameters.Offers[0])
                })
              }
              else {
                return models.Offer.update(taskParameters.Offers[0], { where: { userId: taskParameters.Offers[0].userId,
                  taskId: taskParameters.id } }).then(update => {
                  return postCreateOrUpdateOffer(task, taskParameters.Offers[0])
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
              const assignedUser = assigned.User.dataValues
              AssignMail.assigned(assignedUser, task.dataValues)
              return task.dataValues
            })
          }
          return task.dataValues
        })
    })
})
