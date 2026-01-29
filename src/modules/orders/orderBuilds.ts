import models from '../../models'
import requestPromise from 'request-promise'
// @ts-ignore - url-search-params has no type definitions
import URLSearchParams from 'url-search-params'
import * as URL from 'url'
import Decimal from 'decimal.js'
import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()
import Sendmail from '../mail/mail'
import { userCustomerCreate } from '../users/userCustomerCreate'
import * as slackModule from '../shared/slack'

const currentModels = models as any
const { notifyBounty } = slackModule as any

type OrderBuildsParams = {
  source_id?: string
  source_type?: string
  currency: string
  provider: string
  amount: number
  email: string
  userId: number
  taskId: number
  plan?: string
  customer_id?: string
  walletId?: number
}

export async function orderBuilds(orderParameters: OrderBuildsParams) {
  const { source_id, source_type, currency, provider, amount, email, userId, taskId, plan } =
    orderParameters
  const taskUrl = `${process.env.API_HOST}/#/task/${orderParameters.taskId}`
  const order = await currentModels.Order.build({
    source_id: source_id || 'internal_' + Math.random(),
    source_type: source_type,
    currency: currency,
    provider: provider,
    amount: amount,
    email: email,
    userId: userId,
    TaskId: taskId,
    include: [
      currentModels.User,
      {
        association: currentModels.Order.Plan,
        include: [currentModels.Plan.plan]
      }
    ]
  }).save()

  if (plan === 'open source') {
    const planFeeBasedOnPrice = amount >= 5000 ? 'Open Source - no fee' : 'Open Source - default'
    const planSchema = await currentModels.PlanSchema.findOne({
      where: {
        plan: plan,
        name: planFeeBasedOnPrice,
        feeType: 'charge'
      }
    })

    await order.createPlan({
      plan: plan,
      PlanSchemaId: planSchema.id,
      fee: parseInt(planSchema.fee) > 0 ? (planSchema.fee / 100) * amount : 0,
      feePercentage: planSchema.fee
    })
  }

  const orderCreated = await order.reload({
    include: [
      { model: currentModels.Task },
      { model: currentModels.User },
      {
        model: currentModels.Plan,
        include: [{ model: currentModels.PlanSchema }]
      }
    ]
  })
  const orderUserModel = orderCreated.User
  const orderUser = orderUserModel.dataValues
  const taskTitle = orderCreated?.Task?.dataValues?.title || ''
  const percentage = orderCreated.Plan?.feePercentage

  if (orderParameters.provider === 'stripe' && orderParameters.source_type === 'invoice-item') {
    const unitAmount = (parseInt(String(orderParameters.amount)) * 100 * (1 + percentage / 100)).toFixed(0)
    const quantity = 1

    if (!orderParameters.customer_id) {
      const newCustomer = await userCustomerCreate(orderUser.id, { email: orderUser.email })
      orderParameters.customer_id = newCustomer.id
      orderUserModel.reload()
    }

    const invoice = await stripe.invoices.create({
      customer: orderParameters.customer_id,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        task_id: orderParameters.taskId,
        order_id: orderCreated.dataValues.id
      }
    })

    // Create invoice item (line item on the invoice)
    // Note: We don't store the invoice item ID, only the invoice ID, as the invoice item is part of the invoice
    const invoiceItem = await stripe.invoiceItems.create({
      customer: orderParameters.customer_id,
      currency: 'usd',
      quantity,
      description:
        'Development service for solving an issue on Gitpay: ' + taskTitle + '(' + taskUrl + ')',
      unit_amount: unitAmount,
      invoice: invoice.id,
      metadata: {
        task_id: orderParameters.taskId,
        order_id: orderCreated.dataValues.id
      }
    })

    // Verify invoice item was created successfully
    if (!invoiceItem || !invoiceItem.id) {
      throw new Error('Failed to create invoice item')
    }

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    Sendmail.success(
      { ...orderUser, email: orderParameters.email },
      'Invoice created',
      `An invoice has been created for the task: ${taskUrl}, you can pay it by clicking on the following link: ${finalizedInvoice.hosted_invoice_url}`
    )

    const orderUpdated = await orderCreated.update(
      {
        source_id: invoice.id
      },
      {
        where: {
          id: orderCreated.dataValues.id
        },
        include: [{ model: currentModels.User }]
      }
    )
    await stripe.invoices.sendInvoice(invoice.id)
    return orderUpdated
  }

  if (orderParameters.provider === 'paypal') {
    const totalPrice = currentModels.Plan.calcFinalPrice(orderParameters.amount, orderParameters.plan)
    const response = await requestPromise({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        Authorization:
          'Basic ' +
          Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
            'base64'
          ),
        'Content-Type': 'application/json',
        grant_type: 'client_credentials'
      },
      form: {
        grant_type: 'client_credentials'
      }
    })

    const payment = await requestPromise({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders`,
      headers: {
        Accept: '*/*',
        Prefer: 'return=representation',
        'Accept-Language': 'en_US',
        Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'AUTHORIZE',
        purchase_units: [
          {
            amount: {
              value: totalPrice,
              currency_code: orderParameters.currency
            },
            description: 'Development services provided by Gitpay'
          }
        ],
        application_context: {
          return_url: `${process.env.API_HOST}/orders/authorize`,
          cancel_url: `${process.env.API_HOST}/orders/authorize`
        },
        payer: {
          payment_method: 'paypal'
        }
      })
    })

    const paymentData = JSON.parse(payment)
    const paymentUrl = paymentData.links[1].href
    const resultUrl = URL.parse(paymentUrl)
    const searchParams = new URLSearchParams(resultUrl.search)

    const orderUpdated = await orderCreated.update(
      {
        source_id: paymentData.id,
        authorization_id:
          paymentData.purchase_units &&
          paymentData.purchase_units[0] &&
          paymentData.purchase_units[0].payments &&
          paymentData.purchase_units[0].payments.authorizations[0].id,
        payment_url: paymentUrl,
        token: searchParams.get('token')
      },
      {
        where: {
          id: orderCreated.dataValues.id
        }
      }
    )

    return orderUpdated
  }

  if (orderParameters.provider === 'wallet' && orderParameters.source_type === 'wallet-funds') {
    const wallet = await currentModels.Wallet.findOne({
      where: {
        id: orderParameters.walletId
      }
    })

    if (!wallet) {
      throw new Error(`Wallet with id ${orderParameters.walletId} not found`)
    }

    // Wallet balance is calculated from WalletOrders via afterFind hook
    // The balance field is updated by the hook after findOne
    // Convert to Decimal for comparison (balance is a string after hook processing)
    const currentBalance = new Decimal(wallet.balance || '0.00')
    const enoughBalance = currentBalance.greaterThanOrEqualTo(new Decimal(orderParameters.amount))

    if (!enoughBalance) {
      throw new Error(
        `Not enough balance. current: ${currentBalance}, amount: ${orderParameters.amount}`
      )
    }

    const orderUpdated = await orderCreated.update(
      {
        status: 'succeeded',
        source_id: `${wallet.id}`,
        source_type: 'wallet-funds',
        paid: true
      },
      {
        where: {
          id: orderCreated.dataValues.id
        }
      }
    )

    // Send Slack notification for wallet payment (paid immediately)
    // Note: This only runs for wallet payments that complete successfully
    // Reload order with associations to ensure Task and User are available
    const orderWithAssociations = await currentModels.Order.findByPk(orderCreated.dataValues.id, {
      include: [currentModels.Task, currentModels.User]
    })

    if (orderWithAssociations && orderWithAssociations.Task && orderWithAssociations.User) {
      const orderData = {
        amount: orderCreated.dataValues.amount,
        currency: orderCreated.dataValues.currency || 'USD'
      }
      await notifyBounty(
        orderWithAssociations.Task,
        orderData,
        orderWithAssociations.User,
        'wallet payment'
      )
    }

    return orderUpdated
  }

  return orderCreated
}
