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
const memberExists = require('../members').memberExists
const i18n = require('i18n')

const createSourceAndCharge = Promise.method((customer, orderParameters, order, task, user) => {
  return stripe.customers.createSource(customer.id, { source: orderParameters.source_id }).then(card => {
    const totalPrice = models.Plan.calFinalPrice(orderParameters.amount, orderParameters.plan) * 100
    return stripe.charges.create({
      amount: totalPrice,
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
          if (orderParameters.plan === 'full') {
            PaymentMail.support(user, task, order)
          }
          PaymentMail.success(user, task, order.amount)
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
    }).catch(e => {
      // eslint-disable-next-line no-console
      console.log('could not create charge', e)
      throw new Error(e)
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
      AssignMail.interested(user.dataValues, task.dataValues)
      if (task.dataValues.User) {
        const ownerUser = task.dataValues.User.dataValues
        AssignMail.owner.interested(ownerUser, task.dataValues, user, offer)
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
      individualHooks: true,
      include: [models.User, models.Order, models.Offer, models.Member]
    }).then((data) => {
      if (!data) {
        return new Error('task_updated_failed')
      }
      return models.Task.findById(taskParameters.id, { include: [models.User, models.Order, models.Assign, models.Member] })
        .then((task) => {
          if (!task) {
            return new Error('task_find_failed')
          }
          if (taskParameters.Orders) {
            return task.createOrder(taskParameters.Orders).then((order) => {
              const orderParameters = taskParameters.Orders
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

          if (taskParameters.Offer) {
            return assignExist({
              userId: taskParameters.Offer.userId,
              taskId: taskParameters.id
            }).then(existingAssign => {
              if (!existingAssign) {
                return task.createAssign({ userId: taskParameters.Offer.userId })
              }
            }).then(assign => {
              return offerExists({
                userId: taskParameters.Offer.userId,
                taskId: taskParameters.id
              }).then(resp => {
                if (!resp) {
                  return task.createOffer(taskParameters.Offer).then(offer => {
                    return postCreateOrUpdateOffer(task, taskParameters.Offer)
                  })
                }
                else {
                  return models.Offer.update(taskParameters.Offer,
                    { where:
                       { userId: taskParameters.Offer.userId,
                         taskId: taskParameters.id }
                    }).then(update => {
                    return postCreateOrUpdateOffer(task, taskParameters.Offer)
                  })
                }
              })
            })
          }

          if (taskParameters.Members) {
            return memberExists({
              userId: taskParameters.Members[0].userId
            }).then(resp => {
              if (!resp) {
                return task.createMember(taskParameters.Members[0]).then(member => {
                  return task.dataValues
                }).catch(e => {
                  return task.dataValues
                })
              }
              else {
                return models.Member.update(taskParameters.Members[0], {
                  where: {
                    userId: taskParameters.Members[0].userId,
                    taskId: taskParameters.id
                  }
                }).then(update => {
                  return task.dataValues
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
              return task.updateAttributes({ status: 'in_progress' }).then(() => {
                const assignedUser = assigned.User.dataValues
                const ownerUser = task.dataValues.User.dataValues
                const interestedUsersId = task.Assigns.map(user => user.userId).filter(user => user !== assignedUser.id)
                AssignMail.owner.assigned(ownerUser, task.dataValues, assignedUser)
                AssignMail.assigned(assignedUser, task.dataValues)
                return { interestedUsersId, assignedUser }
              })
            }).then(({ interestedUsersId, assignedUser }) => {
              return models.User.findAll({
                where: {
                  id: interestedUsersId
                }
              }).then(users => {
                users.forEach(user => {
                  AssignMail.notifyInterestedUser(user.dataValues, task.dataValues, assignedUser)
                })
                return task.dataValues
              })
            })
          }
          return task.dataValues
        })
    })
})
