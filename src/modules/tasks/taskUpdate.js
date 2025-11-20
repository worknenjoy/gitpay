const AssignMail = require('../mail/assign')
const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()
const DeadlineMail = require('../mail/deadline')
const assignExist = require('../assigns').assignExists
const offerExists = require('../offers').offerExists
const memberExists = require('../members').memberExists
const i18n = require('i18n')
const validateCoupon = require('../coupon/validateCoupon')
const processCoupon = require('../coupon/processCouponUsage')
const orderUpdateAfterStripe = require('../orders/orderUpdateAfterStripe')

const createSourceAndCharge = Promise.method(
  (customer, orderParameters, order, task, user, couponValidation) => {
    return stripe.customers
      .createSource(customer.id, { source: orderParameters.source_id })
      .then(async (card) => {
        let totalPrice = 0

        if (couponValidation) {
          const couponProcessResult = await processCoupon(couponValidation)

          if (!couponProcessResult) {
            return task
          }

          await order.update({ couponId: couponValidation.id }, { where: { id: order.id } })

          // This means that the amount of discount provided by coupon is 100%
          if (couponValidation.orderPrice <= 0.5) {
            return orderUpdateAfterStripe(order, null, null, orderParameters, user, task, true)
          }

          totalPrice =
            models.Plan.calcFinalPrice(couponValidation.orderPrice, orderParameters.plan) * 100
        } else {
          totalPrice =
            models.Plan.calcFinalPrice(orderParameters.amount, orderParameters.plan) * 100
        }

        return stripe.charges
          .create({
            amount: totalPrice,
            currency: orderParameters.currency,
            customer: customer.id,
            source: card.id,
            transfer_group: `task_${task.dataValues.id}`,
            metadata: { order_id: order.dataValues.id },
          })
          .then((charge) => {
            if (charge) {
              return orderUpdateAfterStripe(order, charge, card, orderParameters, user, task, false)
            }
            throw new Error('no charge')
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('could not create charge', e)
            throw new Error(e)
          })
      })
  },
)

const createCustomer = Promise.method((orderParameters, order, task, user, couponValidation) => {
  return stripe.customers
    .create({
      email: orderParameters.email,
    })
    .then((customer) => {
      if (order.userId) {
        return models.User.update(
          { customer_id: customer.id },
          { where: { id: order.userId } },
        ).then((update) => {
          if (!update) {
            throw new Error('user not updated')
          }
          return createSourceAndCharge(
            customer,
            orderParameters,
            order,
            task,
            user,
            couponValidation,
          )
        })
      }
      return createSourceAndCharge(customer, orderParameters, order, task, user, couponValidation)
    })
})

const postCreateOrUpdateOffer = Promise.method((task, offer) => {
  if (offer) {
    return models.User.findOne({
      where: {
        id: offer.userId,
      },
    }).then((user) => {
      const usermail = user.dataValues.email
      const language = user.language || 'en'
      i18n.setLocale(language)
      if (!usermail) {
        AssignMail.error('mail.assign.register.error' + task.dataValues)
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

module.exports = Promise.method(async function taskUpdate(taskParameters, notifyOnAssign = true) {
  let couponValidation = null

  if (taskParameters.coupon) {
    couponValidation = await validateCoupon(taskParameters.coupon)
  }

  return models.Task.update(taskParameters, {
    where: {
      id: taskParameters.id,
      userId: taskParameters.userId,
    },
    individualHooks: true,
    include: [models.User, models.Order, models.Offer, models.Member],
  }).then((data) => {
    if (!data) {
      return new Error('task_updated_failed')
    }
    return models.Task.findByPk(taskParameters.id, {
      include: [models.User, models.Order, models.Assign, models.Member],
    }).then((task) => {
      if (!task) {
        return new Error('task_find_failed')
      }
      if (taskParameters.Orders) {
        return task.createOrder(taskParameters.Orders).then((order) => {
          const orderParameters = taskParameters.Orders
          if (order.userId) {
            return models.User.findByPk(order.userId).then((user) => {
              if (user && user.dataValues.customer_id) {
                return stripe.customers.retrieve(user.customer_id).then((customer) => {
                  return createSourceAndCharge(
                    customer,
                    orderParameters,
                    order,
                    task,
                    user.dataValues,
                    couponValidation,
                  )
                })
              } else {
                return createCustomer(
                  orderParameters,
                  order,
                  task,
                  user.dataValues,
                  couponValidation,
                )
              }
            })
          } else {
            return createCustomer(
              orderParameters,
              order,
              task,
              { email: orderParameters.email },
              couponValidation,
            )
          }
        })
      }

      if (taskParameters.deadline) {
        if (task.dataValues.assigned) {
          return models.Assign.findOne({
            where: {
              id: task.dataValues.assigned,
            },
            include: [models.User],
          }).then((assigned) => {
            const assignedUserDeadline = assigned.User.dataValues
            DeadlineMail.update(
              assignedUserDeadline.email,
              task.dataValues,
              assignedUserDeadline.username,
            )
            return task.dataValues
          })
        }
      }

      if (taskParameters.Offer) {
        return assignExist({
          userId: taskParameters.Offer.userId,
          taskId: taskParameters.id,
        })
          .then((existingAssign) => {
            if (!existingAssign) {
              return task.createAssign({ userId: taskParameters.Offer.userId })
            }
          })
          .then((assign) => {
            return offerExists({
              userId: taskParameters.Offer.userId,
              taskId: taskParameters.id,
            }).then((resp) => {
              if (!resp) {
                return task.createOffer(taskParameters.Offer).then((offer) => {
                  return postCreateOrUpdateOffer(task, taskParameters.Offer)
                })
              } else {
                return models.Offer.update(taskParameters.Offer, {
                  where: { userId: taskParameters.Offer.userId, taskId: taskParameters.id },
                }).then((update) => {
                  return postCreateOrUpdateOffer(task, taskParameters.Offer)
                })
              }
            })
          })
      }

      if (taskParameters.Members) {
        return memberExists({
          userId: taskParameters.Members[0].userId,
        }).then((resp) => {
          if (!resp) {
            return task
              .createMember(taskParameters.Members[0])
              .then((member) => {
                return task.dataValues
              })
              .catch((e) => {
                return task.dataValues
              })
          } else {
            return models.Member.update(taskParameters.Members[0], {
              where: {
                userId: taskParameters.Members[0].userId,
                taskId: taskParameters.id,
              },
            }).then((update) => {
              return task.dataValues
            })
          }
        })
      }

      if (taskParameters.assigned) {
        return models.Assign.findOne({
          where: {
            id: taskParameters.assigned,
          },
          include: [models.User],
        })
          .then((assigned) => {
            return task.update({ status: 'in_progress' }).then(() => {
              const assignedUser = assigned.User.dataValues
              const ownerUser = task.dataValues.User.dataValues
              const interestedUsersId = task.Assigns.map((user) => user.userId).filter(
                (user) => user !== assignedUser.id,
              )
              notifyOnAssign && AssignMail.owner.assigned(ownerUser, task.dataValues, assignedUser)
              notifyOnAssign && AssignMail.assigned(assignedUser, task.dataValues)
              return { interestedUsersId, assignedUser }
            })
          })
          .then(({ interestedUsersId, assignedUser }) => {
            return task.dataValues
          })
      }
      return task.dataValues
    })
  })
})
