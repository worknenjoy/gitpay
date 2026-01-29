import models from '../../models'
import AssignMail from '../mail/assign'
import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()
import DeadlineMail from '../mail/deadline'
import { assignExists as assignExist } from '../assigns'
import { offerExists } from '../offers'
import { memberExists } from '../members'
import i18n from 'i18n'
import { validateCoupon } from '../coupon/validateCoupon'
import { processCouponUsage as processCoupon } from '../coupon/processCouponUsage'
import { orderUpdateAfterStripe } from '../orders/orderUpdateAfterStripe'

const currentModels = models as any

const createSourceAndCharge = async (
  customer: any,
  orderParameters: any,
  order: any,
  task: any,
  user: any,
  couponValidation: any
) => {
  try {
    const card = await stripe.customers.createSource(customer.id, { source: orderParameters.source_id })
    
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
        currentModels.Plan.calcFinalPrice(couponValidation.orderPrice, orderParameters.plan) * 100
    } else {
      totalPrice =
        currentModels.Plan.calcFinalPrice(orderParameters.amount, orderParameters.plan) * 100
    }

    const charge = await stripe.charges.create({
      amount: totalPrice,
      currency: orderParameters.currency,
      customer: customer.id,
      source: card.id,
      transfer_group: `task_${task.dataValues.id}`,
      metadata: { order_id: order.dataValues.id }
    })
    
    if (charge) {
      return orderUpdateAfterStripe(order, charge, card, orderParameters, user, task, false)
    }
    throw new Error('no charge')
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log('could not create charge', e)
    throw new Error(e.message || e)
  }
}

const createCustomer = async (orderParameters: any, order: any, task: any, user: any, couponValidation: any) => {
  try {
    const customer = await stripe.customers.create({
      email: orderParameters.email
    })

    if (order.userId) {
      const update = await currentModels.User.update(
        { customer_id: customer.id },
        { where: { id: order.userId } }
      )
      
      if (!update) {
        throw new Error('user not updated')
      }
      return createSourceAndCharge(
        customer,
        orderParameters,
        order,
        task,
        user,
        couponValidation
      )
    }
    return createSourceAndCharge(customer, orderParameters, order, task, user, couponValidation)
  } catch (error) {
    throw error
  }
}

const postCreateOrUpdateOffer = async (task: any, offer: any) => {
  if (offer) {
    try {
      const user = await currentModels.User.findOne({
        where: {
          id: offer.userId
        }
      })

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
    } catch (error) {
      throw error
    }
  }
}

export async function taskUpdate(taskParameters: any, notifyOnAssign: boolean = true) {
  let couponValidation = null

  if (taskParameters.coupon) {
    couponValidation = await validateCoupon(taskParameters.coupon)
  }

  try {
    const data = await currentModels.Task.update(taskParameters, {
      where: {
        id: taskParameters.id,
        userId: taskParameters.userId
      },
      individualHooks: true,
      include: [currentModels.User, currentModels.Order, currentModels.Offer, currentModels.Member]
    })

    if (!data) {
      return new Error('task_updated_failed')
    }
    
    const task = await currentModels.Task.findByPk(taskParameters.id, {
      include: [currentModels.User, currentModels.Order, currentModels.Assign, currentModels.Member]
    })

    if (!task) {
      return new Error('task_find_failed')
    }
    
    if (taskParameters.Orders) {
      const order = await task.createOrder(taskParameters.Orders)
      const orderParameters = taskParameters.Orders
      
      if (order.userId) {
        const user = await currentModels.User.findByPk(order.userId)
        
        if (user && user.dataValues.customer_id) {
          const customer = await stripe.customers.retrieve(user.customer_id)
          return createSourceAndCharge(
            customer,
            orderParameters,
            order,
            task,
            user.dataValues,
            couponValidation
          )
        } else {
          return createCustomer(
            orderParameters,
            order,
            task,
            user.dataValues,
            couponValidation
          )
        }
      } else {
        return createCustomer(
          orderParameters,
          order,
          task,
          { email: orderParameters.email },
          couponValidation
        )
      }
    }

    if (taskParameters.deadline) {
      if (task.dataValues.assigned) {
        const assigned = await currentModels.Assign.findOne({
          where: {
            id: task.dataValues.assigned
          },
          include: [currentModels.User]
        })

        const assignedUserDeadline = assigned.User.dataValues
        DeadlineMail.update(
          assignedUserDeadline.email,
          task.dataValues,
          assignedUserDeadline.username
        )
        return task.dataValues
      }
    }

    if (taskParameters.Offer) {
      const existingAssign = await assignExist({
        userId: taskParameters.Offer.userId,
        taskId: taskParameters.id
      })

      if (!existingAssign) {
        await task.createAssign({ userId: taskParameters.Offer.userId })
      }

      const resp = await offerExists({
        userId: taskParameters.Offer.userId,
        taskId: taskParameters.id
      })

      if (!resp) {
        const offer = await task.createOffer(taskParameters.Offer)
        return postCreateOrUpdateOffer(task, taskParameters.Offer)
      } else {
        const update = await currentModels.Offer.update(taskParameters.Offer, {
          where: { userId: taskParameters.Offer.userId, taskId: taskParameters.id }
        })
        return postCreateOrUpdateOffer(task, taskParameters.Offer)
      }
    }

    if (taskParameters.Members) {
      const resp = await memberExists({
        userId: taskParameters.Members[0].userId,
        taskId: task.dataValues.id
      })

      if (!resp) {
        try {
          const member = await task.createMember(taskParameters.Members[0])
          return task.dataValues
        } catch (e) {
          return task.dataValues
        }
      } else {
        const update = await currentModels.Member.update(taskParameters.Members[0], {
          where: {
            userId: taskParameters.Members[0].userId,
            taskId: taskParameters.id
          }
        })
        return task.dataValues
      }
    }

    if (taskParameters.assigned) {
      const assigned = await currentModels.Assign.findOne({
        where: {
          id: taskParameters.assigned
        },
        include: [currentModels.User]
      })

      await task.update({ status: 'in_progress' })
      
      const assignedUser = assigned.User.dataValues
      const ownerUser = task.dataValues.User.dataValues
      const interestedUsersId = task.Assigns.map((user: any) => user.userId).filter(
        (user: any) => user !== assignedUser.id
      )
      notifyOnAssign && AssignMail.owner.assigned(ownerUser, task.dataValues, assignedUser)
      notifyOnAssign && AssignMail.assigned(assignedUser, task.dataValues)
      
      return task.dataValues
    }
    
    return task.dataValues
  } catch (error) {
    throw error
  }
}
